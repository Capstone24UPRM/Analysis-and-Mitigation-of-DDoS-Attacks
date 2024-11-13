import pyshark
import socket
import pandas as pd

interface = 'en0' # Change interface to machine specific
capture = pyshark.LiveCapture(interface=interface)
capture.sniff(timeout=2)
packet_baselines = {'TCP': 1620, 'CBR': 1597, 'UDP': 1597, 'ACK': 1500 ,'Ping': 1500}
packets = []
count = 0
for packet in capture:
    print(packet.transport_layer)
    try:
        if 'TCP' in packet:
            packet_type = "TCP"
        # Check for ACK packets in TCP (ACK flag is set)
        if 'tcp.flags_ack' in packet.tcp.field_names and packet.tcp.flags_ack == '1':
            packet_type = "ACK"
    # Check if it's a UDP packet
        elif 'UDP' in packet:
            packet_type = "UDP"
        # Check if it's an ICMP packet (Ping requests/replies)
        elif 'ICMP' in packet:
            # ICMP type 8 is Echo Request, type 0 is Echo Reply
            if packet.icmp.type == '8':
                packet_type = "Ping Request"
            elif packet.icmp.type == '0':
                packet_type = "Ping Reply"

        # Determine CBR by checking for UDP/RTP with a consistent packet size or interval (simplified heuristic)
        # CBR detection often requires deeper analysis over time.
        if 'UDP' in packet:
            try:
                packet_length = int(packet.length)
                packet_timestamp = datetime.datetime.strptime(packet.sniff_time.isoformat(), "%Y-%m-%dT%H:%M:%S.%f")
                
                # Simple heuristic: detect CBR based on consistent packet sizes and intervals
                if packet_length == 1200: 
                    packet_type = "CBR"
            except Exception as e:
                print(f"Error analyzing packet for CBR: {e}")
        pkt_data = {
            'PKT_TYPE': packet_type,
            'FLAGS': packet.tcp.flags if 'tcp' in packet else None,
            'NUMBER_OF_PKT': 1,
            'PKT_R': packet.length,
            'PKT_RATE': packet.tcp.window_size if 'tcp' in packet else None,
    'UTILIZATION': packet.ip.dsfield_dscp if packet.ip.dsfield_dscp is 0 or packet.ip.dsfield_dscp is None else (packet.length/packet_baselines[packet_type] * 100) ,
            'PKT_DELAY': float(packet.tcp.time_delta) if 'tcp' in packet else None,
            'session_duration': None,
            'ttl': int(packet.ip.ttl) if 'ip' in packet else None,
            'request_rate': None
        }
        packets.append(pkt_data)
        count += 1
        if count > len(capture):
            break
    except AttributeError:
        # Skip packets that are missing fields
        pass
    
    
packets_data = pd.DataFrame(packets)
print(packets_data)
