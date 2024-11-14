import pyshark
import asyncio
import pandas as pd
from datetime import datetime
from threading import Thread

# Define network interface and capture settings
PORT = "443"
interface = 'Wi-Fi'  # Replace with your network interface

# Baseline values for utilization calculation
packet_baselines = {'TCP': 1620, 'CBR': 1597, 'UDP': 1597, 'ACK': 1500, 'Ping': 1500}

# Storage for sessions
sessions = {}

def capture_packets():
    # Set up a new event loop for the thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Initialize the capture and sniff packets
    capture = pyshark.LiveCapture(interface=interface, bpf_filter=f"port {PORT}")
    
    # Sniff packets (adjust timeout or packet_count as needed)
    # capture.sniff_continuously()
    capture.sniff(timeout=2, packet_count=3)

    # Process each packet to classify and track session details
    for packet in capture:
        try:
            # Initialize packet type and session key
            packet_type = None
            src_ip = packet.ip.src if hasattr(packet, 'ip') else None
            dst_ip = packet.ip.dst if hasattr(packet, 'ip') else None
            protocol = packet.transport_layer
            timestamp = datetime.fromtimestamp(float(packet.sniff_timestamp))
            packet_length = int(packet.length)
            ttl = int(packet.ip.ttl) if hasattr(packet, 'ip') else None

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
            session_key = (src_ip, dst_ip, protocol)

            # Calculate utilization for this packet
            utilization = (packet_length / packet_baselines.get(packet_type, 1)) * 100

            # Process the session information
            if session_key not in sessions:
                sessions[session_key] = {
                    'SRC_IP': src_ip,
                    'DST_IP': dst_ip,
                    'PROTOCOL': protocol,
                    'FIRST_PKT_SENT': timestamp,
                    'LAST_PKT_RESEVED': timestamp,
                    'NUMBER_OF_PKT': 1,
                    'TOTAL_PKT_LENGTH': packet_length,
                    'PKT_Rate': None,
                    'session_rate': None,
                    'FLAGS': flags,
                    'UTILIZATION': utilization,
                    'TTL': ttl,
                    'PKT_TYPE': packet_type,
                }
            else:
                sessions[session_key]['LAST_PKT_RESEVED'] = timestamp
                sessions[session_key]['NUMBER_OF_PKT'] += 1
                sessions[session_key]['TOTAL_PKT_LENGTH'] += packet_length
                sessions[session_key]['FLAGS'] = flags
                sessions[session_key]['UTILIZATION'] = utilization
                sessions[session_key]['TTL'] = ttl
                sessions[session_key]['PKT_TYPE'] = packet_type

            # Calculate session duration
            session_duration = (sessions[session_key]['LAST_PKT_RESEVED'] - sessions[session_key]['FIRST_PKT_SENT']).total_seconds()
            if session_duration > 0:
                sessions[session_key]['PKT_Rate'] = sessions[session_key]['NUMBER_OF_PKT'] / session_duration
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
            'PROTOCOL': session['PROTOCOL'],
            'FIRST_PKT_SENT': session['FIRST_PKT_SENT'],
            'LAST_PKT_RESEVED': session['LAST_PKT_RESEVED'],
            'NUMBER_OF_PKT': session['NUMBER_OF_PKT'],
            'session_duration': session_duration,
            'PKT_Rate': session['PKT_Rate'] if not pd.isna(session['PKT_Rate']) else 0, # division by zero outputs NaN
            'session_rate': session['session_rate'] if not pd.isna(session['session_rate']) else 0,  # Bytes per second
            'FLAGS': session['FLAGS'],
            'UTILIZATION': session['UTILIZATION'],
            'TTL': session['TTL'],
            'PKT_TYPE': session['PKT_TYPE'],
            'request_rate': request_rate
        })

    df_sessions = pd.DataFrame(session_data)
    print(df_sessions)

# Start packet capture in a separate thread
thread = Thread(target=capture_packets)
thread.start()
thread.join()


# pkt_data = {
# #         #     'PKT_TYPE': packet_type,
# #         #     'FLAGS': packet.tcp.flags if hasattr(packet, 'tcp') else None,
# #         #     'NUMBER_OF_PKT': 1,
# #         #     'PKT_R': int(packet.length),
# #         #     'PKT_RATE': int(packet.tcp.window_size) if hasattr(packet, 'tcp') else None,
# #         #     'UTILIZATION': (int(packet.length) / packet_baselines.get(packet_type, 1)) * 100,
# #         #     'PKT_DELAY': float(packet.tcp.time_delta) if hasattr(packet, 'tcp') else None,
# #         #     'session_duration': None,  # Will be calculated at the session end
# #         #     'ttl': int(packet.ip.ttl) if hasattr(packet, 'ip') else None,
# #         #     'request_rate': None  # Placeholder for rate calculation if needed
# #         # }
