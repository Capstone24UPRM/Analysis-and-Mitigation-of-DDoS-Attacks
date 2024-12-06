from scapy.all import sniff, IP, TCP, UDP, ICMP
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from joblib import load
from sklearn.preprocessing import LabelEncoder
import asyncio
import time
import os
from itertools import combinations, permutations

# Define network interface and capture settings
PORT = "443"
interface = 'lo0'  # Replace with your network interface

# Baseline values for utilization calculation
packet_baselines = {'TCP': 1620, 'CBR': 1597, 'UDP': 1597, 'ACK': 1500, 'Ping': 1500}

# Storage for sessions
sessions = {}

# Pre-trained Random Forest model
model = load("random_forest_model_3.joblib")
le = LabelEncoder()

# Define individual flags and their numeric values
FLAG_VALUES = {
    'F': 0x01,  # FIN
    'S': 0x02,  # SYN
    'R': 0x04,  # RST
    'P': 0x08,  # PSH
    'A': 0x10,  # ACK
    'U': 0x20,  # URG
    'E': 0x40,  # ECE
    'C': 0x80,  # CWR
}

TCP_FLAG_VALUES = {
    'F': 0x01, 'S': 0x02, 'R': 0x04, 'P': 0x08, 'A': 0x10, 'U': 0x20, 'E': 0x40, 'C': 0x80,
    'FS': 0x03, 'SF': 0x03, 
    'FR': 0x05, 'RF': 0x05, 
    'FP': 0x09, 'PF': 0x09, 
    'FA': 0x11, 'AF': 0x11,
    'FU': 0x21, 'UF': 0x21, 
    'FE': 0x41, 'EF': 0x41, 
    'FC': 0x81, 'CF': 0x81,
    'SR': 0x06, 'RS': 0x06, 
    'SP': 0x0A, 'PS': 0x0A, 
    'SA': 0x12, 'AS': 0x12, 
    'SU': 0x22, 'US': 0x22,
    'SE': 0x42, 'ES': 0x42, 
    'SC': 0x82, 'CS': 0x82,
    'RP': 0x0C, 'PR': 0x0C, 
    'RA': 0x14, 'AR': 0x14, 
    'RU': 0x24, 'UR': 0x24, 
    'RE': 0x44, 'ER': 0x44,
    'RC': 0x84, 'CR': 0x84,
    'PA': 0x18, 'AP': 0x18, 
    'PU': 0x28, 'UP': 0x28, 
    'PE': 0x48, 'EP': 0x48, 
    'PC': 0x88, 'CP': 0x88,
    'AU': 0x30, 'UA': 0x30, 
    'AE': 0x50, 'EA': 0x50, 
    'AC': 0x90, 'CA': 0x90,
    'UE': 0x60, 'EU': 0x60, 
    'UC': 0xA0, 'CU': 0xA0,
    'EC': 0xC0, 'CE': 0xC0,
    '': 0x00
}

PKT_TYPE_VALUES = {
    'TCP': 0,
    'UDP': 1,
    'ICMP': 2,
    'ACK': 3,
    'CBR': 4,
    'Unknown': 5
}

def preProcessing(df):
    # Debug print
    # print(df["FLAGS"][0])
    # print(df["PKT_TYPE"][0])

    df['PKT_TYPE'] = df['PKT_TYPE'].map(PKT_TYPE_VALUES)
    df['FLAGS'] = df['FLAGS'].map(TCP_FLAG_VALUES)

    # Debug print
    # print(df["FLAGS"].head())

def process_sessions():
    # Convert sessions to DataFrame
    session_data = []
    for key, session in sessions.items():
        session_duration = (session['LAST_PKT_RECEIVED'] - session['FIRST_PKT_SENT']).total_seconds()
        request_rate = session['NUMBER_OF_PKT'] / session_duration if session_duration > 0 else 0
        session_data.append({
            'SRC_IP': session['SRC_IP'],
            'DST_IP': session['DST_IP'],
            'PKT_TYPE': session['PKT_TYPE'],
            'FIRST_PKT_SENT': session['FIRST_PKT_SENT'],
            'LAST_PKT_RECEIVED': session['LAST_PKT_RECEIVED'],
            'NUMBER_OF_PKT': session['NUMBER_OF_PKT'],
            'session_duration': session_duration,
            'PKT_RATE': session['PKT_RATE'] if session['PKT_RATE'] else 0,
            'session_rate': session['session_rate'] if session['session_rate'] else 0,
            'FLAGS': session['FLAGS'],
            'UTILIZATION': session['UTILIZATION'],
            'ttl': session['ttl'],
            'request_rate': request_rate
        })

    df_sessions = pd.DataFrame(session_data)
    # Predict using the model
    if not df_sessions.empty:
        preProcessing(df_sessions)
        df_sessions_required = df_sessions[[
            "PKT_TYPE", "NUMBER_OF_PKT", "session_duration", "PKT_RATE","session_rate", "FLAGS",  
            "UTILIZATION",  "ttl", "request_rate"
        ]]
        # df_sessions["LABEL"] = 'GET Flood' # Change based on attack type
        csv_file = 'prediction_result.csv'
        df_sessions['PREDICTION'] = model.predict(df_sessions_required)
        if not os.path.exists(csv_file):
            df_sessions. to_csv(csv_file, index=False)
        else:
            df_sessions.to_csv(csv_file, mode='a', header=False, index=False)

        # print(df_sessions.head())
       
        print(df_sessions)
        # df_sessions.to_csv('prediction_result.csv', index=False)

def packet_handler(packet):
    try:
        # Initialize packet type and session key
        packet_type = None
        src_ip = packet[IP].src if IP in packet else None
        dst_ip = packet[IP].dst if IP in packet else None
        protocol = packet.payload.name
        timestamp = datetime.fromtimestamp(packet.time)
        packet_length = len(packet)
        ttl = packet[IP].ttl if IP in packet else None

        if not src_ip or not dst_ip:
            return

        # Determine packet type and set packet_type accordingly
        flags = None
        if TCP in packet:
            packet_type = "TCP"
            flags = packet[TCP].flags
            if flags == 'A':
                packet_type = "ACK"
        elif UDP in packet:
            packet_type = "UDP"
            if packet_length == 1200:
                packet_type = "CBR"
        elif ICMP in packet:
            icmp_type = packet[ICMP].type
            if icmp_type == 8:
                packet_type = "Ping Request"
            elif icmp_type == 0:
                packet_type = "Ping Reply"
        else:
            packet_type = "Unknown"
        # print(f"flag, {}")
        # Create a session key based on src/dst IP and protocol
        session_key = tuple(sorted([src_ip, dst_ip]))

        # Calculate utilization for this packet
        baseline = packet_baselines.get(packet_type, 1)
        utilization = (packet_length / baseline) * 100

        # Process the session information
        if session_key not in sessions:
            sessions[session_key] = {
                'SRC_IP': src_ip,
                'DST_IP': dst_ip,
                'PKT_TYPE': protocol,
                'FIRST_PKT_SENT': timestamp,
                'LAST_PKT_RECEIVED': timestamp,
                'NUMBER_OF_PKT': 1,
                'TOTAL_PKT_LENGTH': packet_length,
                'PKT_RATE': None,
                'session_rate': None,
                'FLAGS': str(flags),
                'UTILIZATION': utilization,
                'ttl': ttl,
                'PKT_TYPE': packet_type,
            }
        else:
            session = sessions[session_key]
            session['LAST_PKT_RECEIVED'] = timestamp
            session['NUMBER_OF_PKT'] += 1
            session['TOTAL_PKT_LENGTH'] += packet_length
            session['FLAGS'] = str(flags)
            session['UTILIZATION'] = utilization
            session['ttl'] = ttl
            session['PKT_TYPE'] = packet_type

        # Calculate session duration
        session_duration = (sessions[session_key]['LAST_PKT_RECEIVED'] - sessions[session_key]['FIRST_PKT_SENT']).total_seconds()
        if session_duration > 0:
            session['PKT_RATE'] = session['NUMBER_OF_PKT'] / session_duration
            session['session_rate'] = session['TOTAL_PKT_LENGTH'] / session_duration

    except Exception as e:
        print(f"Error processing packet: {e}")
        return

async def main():
    PROCESS_INTERVAL = 10  # seconds
    start_time = time.time()

    while True:
        # Start sniffing in async mode
        sniff_thread = asyncio.create_task(
            asyncio.to_thread(
                sniff,
                iface=interface,
                prn=packet_handler,
                timeout=PROCESS_INTERVAL,
                store=False
            )
        )

        await sniff_thread

        # Process the sessions dict
        process_sessions()
        # Optionally, reset sessions dict if appropriate
        sessions.clear()
        # Reset start_time
        start_time = time.time()

if __name__ == "__main__":
    asyncio.run(main())   
