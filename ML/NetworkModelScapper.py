import pyshark
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from threading import Thread
import asyncio
from joblib import load
from sklearn.preprocessing import LabelEncoder

# Define network interface and capture settings
PORT = "443"
interface = 'Wi-Fi'  # Replace with your network interface


# Baseline values for utilization calculation
packet_baselines = {'TCP': 1620, 'CBR': 1597, 'UDP': 1597, 'ACK': 1500, 'Ping': 1500}

# Storage for sessions
sessions = {}

# Pre-trained Random Forest model
model = load("random_forest_model.joblib")
# Assume the model has already been trained on preprocessed data.
# Load pre-trained model here if saved as a file, e.g., using joblib or pickle.

def capture_packets():
    # Set up a new event loop for the thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Initialize the capture and sniff packets
    capture = pyshark.LiveCapture(interface=interface, bpf_filter=f"port {PORT}")
    
    # Sniff packets (adjust timeout or packet_count as needed)
    # capture.sniff_continuously()
    dst_ips = set()
    capture.sniff(timeout=2, packet_count=20)
    print(capture)
    # Process each packet to classify and track session details
    
    for packet in capture:
        if len(sessions) > len(capture):
            break
        try:
            # Initialize packet type and session key
            packet_type = None
            src_ip = packet.ip.src if hasattr(packet, 'ip') else None
            dst_ip = packet.ip.dst if hasattr(packet, 'ip') else None
            protocol = packet.transport_layer
            timestamp = datetime.fromtimestamp(float(packet.sniff_timestamp))
            packet_length = int(packet.length)
            ttl = int(packet.ip.ttl) if hasattr(packet, 'ip') else None

            if not src_ip or not dst_ip:
                continue
            
            if src_ip in dst_ip:
                continue
            dst_ips.add(dst_ip)
            
            
            # Determine packet type and set packet_type accordingly
            if 'TCP' in packet:
                packet_type = "TCP"
                flags = packet.tcp.flags if hasattr(packet, 'tcp') else None
                if 'tcp.flags_ack' in packet.tcp.field_names and packet.tcp.flags_ack == '1':
                    packet_type = "ACK"
            elif 'UDP' in packet:
                packet_type = "UDP"
                flags = None
                if packet_length == 1200:
                    packet_type = "CBR"
            elif 'ICMP' in packet:
                flags = None
                if packet.icmp.type == '8':
                    packet_type = "Ping Request"
                elif packet.icmp.type == '0':
                    packet_type = "Ping Reply"
            if not packet_type:
                packet_type = "Unknown"

            # Create a session key based on src/dst IP and protocol
            session_key = tuple(sorted([src_ip, dst_ip]))

            # Calculate utilization for this packet
            utilization = (packet_length / packet_baselines.get(packet_type, 1)) * 100

            # Process the session information
            if session_key not in sessions:
                sessions[session_key] = {
                    'SRC_IP': src_ip,
                    'DST_IP': dst_ip,
                    'PKT_TYPE': protocol,
                    'FIRST_PKT_SENT': timestamp,
                    'LAST_PKT_RESEVED': timestamp,
                    'NUMBER_OF_PKT': 1,
                    'TOTAL_PKT_LENGTH': packet_length,
                    'PKT_RATE': None,
                    'session_rate': None,
                    'FLAGS': flags,
                    'UTILIZATION': utilization,
                    'ttl': ttl,
                    'PKT_TYPE': packet_type,
                }
            else:
                sessions[session_key]['LAST_PKT_RESEVED'] = timestamp
                sessions[session_key]['NUMBER_OF_PKT'] += 1
                sessions[session_key]['TOTAL_PKT_LENGTH'] += packet_length
                sessions[session_key]['FLAGS'] = flags
                sessions[session_key]['UTILIZATION'] = utilization
                sessions[session_key]['ttl'] = ttl
                sessions[session_key]['PKT_TYPE'] = packet_type

            # Calculate session duration
            session_duration = (sessions[session_key]['LAST_PKT_RESEVED'] - sessions[session_key]['FIRST_PKT_SENT']).total_seconds()
            if session_duration > 0:
                sessions[session_key]['PKT_RATE'] = sessions[session_key]['NUMBER_OF_PKT'] / session_duration
                sessions[session_key]['session_rate'] = sessions[session_key]['TOTAL_PKT_LENGTH'] / session_duration

        except AttributeError:
            continue
        
        

    # Convert sessions to DataFrame
    session_data = []
    for key, session in sessions.items():
        session_duration = (session['LAST_PKT_RESEVED'] - session['FIRST_PKT_SENT']).total_seconds()
        request_rate = session['NUMBER_OF_PKT'] / session_duration if session_duration > 0 else 0
        session_data.append({
            'SRC_IP': session['SRC_IP'],
            'DST_IP': session['DST_IP'],
            'PKT_TYPE': session['PKT_TYPE'],
            'FIRST_PKT_SENT': session['FIRST_PKT_SENT'],
            'LAST_PKT_RESEVED': session['LAST_PKT_RESEVED'],
            'NUMBER_OF_PKT': session['NUMBER_OF_PKT'],
            'session_duration': session_duration,
            'PKT_RATE': session['PKT_RATE'] if not pd.isna(session['PKT_RATE']) else 0, # division by zero outputs NaN
            'session_rate': session['session_rate'] if not pd.isna(session['session_rate']) else 0,  # Bytes per second
            'FLAGS': session['FLAGS'],
            'UTILIZATION': session['UTILIZATION'],
            'ttl': session['ttl'],
            'PKT_TYPE': session['PKT_TYPE'],
            'request_rate': request_rate
        })
        



    df_sessions = pd.DataFrame(session_data)
    # Predict using the model
    if not df_sessions.empty:
        preProcessing(df_sessions)
        df_sessions_required = df_sessions[["PKT_TYPE","FLAGS", "NUMBER_OF_PKT", "PKT_RATE", "UTILIZATION", "session_duration", "ttl", "request_rate"]]
        print(df_sessions.head)
        df_sessions['PREDICTION'] = model.predict(df_sessions_required)
        print(df_sessions)
        df_sessions.to_csv('../Dashboard/front-end/public/Network_Summary.csv', index=False)

def preProcessing(df):
    le = LabelEncoder()
    df['PKT_TYPE'] = le.fit_transform(df['PKT_TYPE'])
    df['FLAGS'] = le.fit_transform(df['FLAGS'])
# Start packet capture
thread = Thread(target=capture_packets)
thread.start()
thread.join()
