from scapy.all import *
import time
import pandas as pd
from joblib import load
from sklearn.preprocessing import LabelEncoder

# Define network interface and capture settings
PORT = "443"
interface = 'Wi-Fi'  # Replace with your network interface

# Load the machine learning model
model = load("random_forest_model.joblib")

# Variables for metrics
pkt_count = 0  # NUMBER_OF_PKT
request_count = 0
data_transferred = 0
max_bandwidth_mbps = 100
start_time = time.time()

# Dictionary to track session start times and durations
sessions = {}

def get_session_key(packet):
    """Generate a unique key for each session based on IP and port."""
    if IP in packet:
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        if TCP in packet or UDP in packet:
            port_src = packet.sport
            port_dst = packet.dport
            return (ip_src, ip_dst, port_src, port_dst)
    return None

def preProcessing(df):
    le = LabelEncoder()
    df['PKT_TYPE'] = le.fit_transform(df['PKT_TYPE'])
    df['FLAGS'] = le.fit_transform(df['FLAGS'])

def process_packet(packet):
    global pkt_count, request_count, data_transferred, start_time

    pkt_type = "Other"
    flags = None
    data_transferred += len(packet)  # packet size

    if packet.haslayer(TCP):
        pkt_type = "TCP"
        flags = packet[TCP].flags
        if packet[TCP].dport == 80 or packet[TCP].dport == 443:  # HTTP/HTTPS
            request_count += 1
    elif packet.haslayer(UDP):
        pkt_type = "UDP"
        flags = None
        if packet[UDP].dport == 53:  # DNS
            request_count += 1
    elif packet.haslayer(ICMP):
        pkt_type = "ICMP"
        flags = None

    pkt_count += 1

    ttl = packet[IP].ttl if IP in packet else None

    # Handle Session Duration
    session_key = get_session_key(packet)
    current_time = time.time()

    session_duration = 0
    if session_key:
        if session_key not in sessions:
            sessions[session_key] = current_time  # Start time of the session
        session_duration = current_time - sessions[session_key]  # Calculate duration

    # Elapsed time
    elapsed_time = current_time - start_time
    pkt_rate = pkt_count / elapsed_time if elapsed_time > 0 else 0
    request_rate = request_count / elapsed_time if elapsed_time > 0 else 0

    # Calculate utilization
    if elapsed_time > 0:
        data_rate_bps = (data_transferred * 8) / elapsed_time
        max_bandwidth_bps = max_bandwidth_mbps * 1_000_000
        utilization = (data_rate_bps / max_bandwidth_bps) * 100
    else:
        utilization = 0

    # Data for DataFrame
    data = {
        "PKT_TYPE": [pkt_type],
        "FLAGS": [str(flags) if flags is not None else "None"],
        "NUMBER_OF_PKT": [pkt_count],
        "PKT_RATE": [pkt_rate],
        "UTILIZATION": [utilization],
        "session_duration": [session_duration],
        "ttl": [ttl],
        "request_rate": [request_rate]
    }

    df = pd.DataFrame(data)
    preProcessing(df)
    df['PREDICTION'] = model.predict(df)

    print(df)

    # Reset counters and start time for the next interval
    if elapsed_time >= 1:
        pkt_count = 0
        request_count = 0
        data_transferred = 0
        start_time = current_time

if __name__ == "__main__":
    sniff(iface=interface, prn=process_packet, store=False, count=50)
