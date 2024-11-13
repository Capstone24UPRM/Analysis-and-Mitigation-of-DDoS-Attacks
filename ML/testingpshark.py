# import pyshark
# import socket
# import pandas as pd

# interface = 'Wi-Fi' # Change interface to machine specific
# capture = pyshark.LiveCapture(interface=interface, bpf_filter="port 53")
# capture.sniff(timeout=2)
# packet_baselines = {'TCP': 1620, 'CBR': 1597, 'UDP': 1597, 'ACK': 1500 ,'Ping': 1500}
# packets = []
# count = 0
# for packet in capture:
#     print(packet.transport_layer)
#     try:
#         if 'TCP' in packet:
#             packet_type = "TCP"
#         # Check for ACK packets in TCP (ACK flag is set)
#         if 'tcp.flags_ack' in packet.tcp.field_names and packet.tcp.flags_ack == '1':
#             packet_type = "ACK"
#     # Check if it's a UDP packet
#         elif 'UDP' in packet:
#             packet_type = "UDP"
#         # Check if it's an ICMP packet (Ping requests/replies)
#         elif 'ICMP' in packet:
#             # ICMP type 8 is Echo Request, type 0 is Echo Reply
#             if packet.icmp.type == '8':
#                 packet_type = "Ping Request"
#             elif packet.icmp.type == '0':
#                 packet_type = "Ping Reply"

#         # Determine CBR by checking for UDP/RTP with a consistent packet size or interval (simplified heuristic)
#         # CBR detection often requires deeper analysis over time.
#         if 'UDP' in packet:
#             try:
#                 packet_length = int(packet.length)
#                 packet_timestamp = datetime.datetime.strptime(packet.sniff_time.isoformat(), "%Y-%m-%dT%H:%M:%S.%f")
                
#                 # Simple heuristic: detect CBR based on consistent packet sizes and intervals
#                 if packet_length == 1200: 
#                     packet_type = "CBR"
#             except Exception as e:
#                 print(f"Error analyzing packet for CBR: {e}")
#         pkt_data = {
#             'PKT_TYPE': packet_type,
#             'FLAGS': packet.tcp.flags if 'tcp' in packet else None,
#             'NUMBER_OF_PKT': 1,
#             'PKT_R': packet.length,
#             'PKT_RATE': packet.tcp.window_size if 'tcp' in packet else None,
#             'UTILIZATION': packet.ip.dsfield_dscp if packet.ip.dsfield_dscp == 0 or packet.ip.dsfield_dscp == None else (int(packet.length)/packet_baselines[packet_type] * 100) ,
#             'PKT_DELAY': float(packet.tcp.time_delta) if 'tcp' in packet else None,
#             'session_duration': None,
#             'ttl': int(packet.ip.ttl) if 'ip' in packet else None,
#             'request_rate': None
#         }
#         packets.append(pkt_data)
#         count += 1
#         if count > len(capture):
#             break
#     except AttributeError:
#         # Skip packets that are missing fields
#         pass
    
    
# packets_data = pd.DataFrame(packets)
# print(packets_data)

import pyshark
import pandas as pd
from datetime import datetime

# Define network interface and capture settings
PORT = ""
interface = 'Wi-Fi'  # Replace with your network interface
capture = pyshark.LiveCapture(interface=interface, bpf_filter=f"port {PORT}")
capture.sniff(timeout=2, packet_count=10)  # Capture duration

# Define baseline values for utilization calculation
packet_baselines = {'TCP': 1620, 'CBR': 1597, 'UDP': 1597, 'ACK': 1500, 'Ping': 1500}

# Define session storage
sessions = {}

packets = []

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
            # Heuristic for CBR based on packet size
            if packet_length == 1200:
                packet_type = "CBR"
        elif 'ICMP' in packet:
            flags = None
            if packet.icmp.type == '8':
                packet_type = "Ping Request"
            elif packet.icmp.type == '0':
                packet_type = "Ping Reply"

        # Default packet type if none was set
        if not packet_type:
            packet_type = "Unknown"

        # Create a session key based on src/dst IP and protocol
        session_key = (src_ip, dst_ip, protocol)

        # Calculate utilization for this packet
        utilization = (packet_length / packet_baselines.get(packet_type, 1)) * 100
        # Check if the session already exists
        if session_key not in sessions:
            # Initialize a new session
            sessions[session_key] = {
                'SRC_IP': src_ip,
                'DST_IP': dst_ip,
                'PROTOCOL': protocol,
                'FIRST_PKT_SENT': timestamp,
                'LAST_PKT_RESEVED': timestamp,
                'NUMBER_OF_PKT': 1,
                'TOTAL_PKT_LENGTH': packet_length,
                'PKT_Rate': None,  # Will be calculated later
                'session_rate': None,  # Will be calculated later
                'FLAGS': flags,
                'UTILIZATION': utilization,
                'TTL': ttl,
                'PKT_TYPE': packet_type,
            }
        else:
            # Update the existing session with the latest packet info
            sessions[session_key]['LAST_PKT_RESEVED'] = timestamp
            sessions[session_key]['NUMBER_OF_PKT'] += 1
            sessions[session_key]['TOTAL_PKT_LENGTH'] += packet_length
            sessions[session_key]['FLAGS'] = flags
            sessions[session_key]['UTILIZATION'] = utilization  # Update utilization
            sessions[session_key]['TTL'] = ttl
            sessions[session_key]['PKT_TYPE'] = packet_type
        # Calculate session duration
        # Capture packet data for individual packet analysis
        session_duration = (sessions[session_key]['LAST_PKT_RESEVED'] - sessions[session_key]['FIRST_PKT_SENT']).total_seconds()

        if session_duration > 0 and session_duration != None:
            sessions[session_key]['PKT_Rate'] = sessions[session_key]['NUMBER_OF_PKT'] / session_duration
            # Calculate session rate as total data per session duration
            sessions[session_key]['session_rate'] = sessions[session_key]['TOTAL_PKT_LENGTH'] / session_duration

        # Capture packet data for individual packet analysis
        pkt_data = {
            'PKT_TYPE': packet_type,
            'FLAGS': packet.tcp.flags if hasattr(packet, 'tcp') else None,
            'NUMBER_OF_PKT': 1,
            'PKT_R': int(packet.length),
            'PKT_RATE': int(packet.tcp.window_size) if hasattr(packet, 'tcp') else None,
            'UTILIZATION': (int(packet.length) / packet_baselines.get(packet_type, 1)) * 100,
            'PKT_DELAY': float(packet.tcp.time_delta) if hasattr(packet, 'tcp') else None,
            'session_duration': None,  # Will be calculated at the session end
            'ttl': int(packet.ip.ttl) if hasattr(packet, 'ip') else None,
            'request_rate': None  # Placeholder for rate calculation if needed
        }

        # Append pkt_data to packets list (you can save for further analysis if needed)
        packets.append(pkt_data)
    except AttributeError:
        # Skip packets that are missing expected fields
        continue

# Calculate session duration and finalize session data
session_data = []
for key, session in sessions.items():
    session_duration = (session['LAST_PKT_RESEVED'] - session['FIRST_PKT_SENT']).total_seconds()
    session_data.append({
        'SRC_IP': session['SRC_IP'],
        'DST_IP': session['DST_IP'],
        'PROTOCOL': session['PROTOCOL'],
        'FIRST_PKT_SENT': session['FIRST_PKT_SENT'],
        'LAST_PKT_RESEVED': session['LAST_PKT_RESEVED'],
        'NUMBER_OF_PKT': session['NUMBER_OF_PKT'],
        'session_duration': session_duration,
        'PKT_Rate': session['PKT_Rate'],
        'session_rate': session['session_rate'],  # Bytes per second
        'FLAGS': session['FLAGS'],
        'UTILIZATION': session['UTILIZATION'],
        'TTL': session['TTL'],
        'PKT_TYPE': session['PKT_TYPE']
    })

# Convert sessions data to DataFrame and display
df_sessions = pd.DataFrame(session_data)
print(df_sessions)
packets_data = pd.DataFrame(packets)
print(packets_data)
