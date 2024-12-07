import argparse
from SynFlood import SynFloodMitigation
from TcpFlood import TcpFloodMitigation
from UdpFlood import UdpFloodMitigation
from Smurf import SmurfAttackMitigation

def main():
    parser = argparse.ArgumentParser(description="DDoS Mitigation Script")
    parser.add_argument("action", choices=["deploy", "remove"], help="Action to perform: deploy or remove mitigation")
    parser.add_argument("type", choices=["syn", "tcp", "udp", "smurf"], help="Type of mitigation: syn, tcp, or udp")
    parser.add_argument("system", choices=["Linux", "Windows", "Darwin"], help="Operating system")
    parser.add_argument("src_address", help="Source address to block")
    parser.add_argument("dst_address", help="Destination address to protect")
    parser.add_argument("port", help="Destination port to protect")

    args = parser.parse_args()

    if args.type == "syn":
        mitigation = SynFloodMitigation(src_address=args.src_address, dst_address=args.dst_address, system=args.system)
    elif args.type == "tcp":
        mitigation = TcpFloodMitigation(src_address=args.src_address, dst_address=args.dst_address, system=args.system, port=args.port)
    elif args.type == "udp":
        mitigation = UdpFloodMitigation(src_address=args.src_address, dst_address=args.dst_address, system=args.system)
    elif args.type == "smurf":
        mitigation = SmurfAttackMitigation(src_address=args.src_address, dst_address=args.dst_address, system=args.system)

    if args.action == "deploy":
        mitigation.deploy_mitigation()
    elif args.action == "remove":
        mitigation.remove_mitigation()

if __name__ == "__main__":
    main()