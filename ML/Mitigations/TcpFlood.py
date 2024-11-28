from Mitigation import Mitigation
import subprocess

class TcpFloodMitigation(Mitigation):
    def deploy_mitigation(self):
        if self.system == "Linux":
            self.mitigate_tcp_flood_linux()
        elif self.system == "Windows":
            self.mitigate_tcp_flood_windows()
        elif self.system == "Darwin":
            self.mitigate_tcp_flood_macos()
        else:
            print("TCP Flood mitigation is not supported on this OS.")

    def remove_mitigation(self):
        if self.system == "Linux":
            self.remove_tcp_flood_linux()
        elif self.system == "Windows":
            self.remove_tcp_flood_windows()
        elif self.system == "Darwin":
            self.remove_tcp_flood_macos()
        else:
            print("TCP Flood mitigation removal is not supported on this OS.")

    # Linux methods
    def mitigate_tcp_flood_linux(self):
        print("Deploying TCP Flood mitigation on Linux...")
        command = f"iptables -A INPUT -p tcp -s {self.src_address} -j DROP"
        subprocess.run(command, shell=True)
        print(f"TCP packets from {self.src_address} are now blocked.")

    def remove_tcp_flood_linux(self):
        print("Removing TCP Flood mitigation on Linux...")
        command = f"iptables -D INPUT -p tcp -s {self.src_address} -j DROP"
        subprocess.run(command, shell=True)
        print("TCP Flood mitigation removed.")

    # Windows methods
    def mitigate_tcp_flood_windows(self):
        print("Deploying TCP Flood mitigation on Windows...")
        rule_name = f"TCP Flood Block {self.src_address}"
        command = f"netsh advfirewall firewall add rule name=\"{rule_name}\" dir=in action=block protocol=TCP remoteip={self.src_address}"
        subprocess.run(command, shell=True)
        print(f"TCP packets from {self.src_address} are now blocked.")

    def remove_tcp_flood_windows(self):
        print("Removing TCP Flood mitigation on Windows...")
        rule_name = f"TCP Flood Block {self.src_address}"
        command = f"netsh advfirewall firewall delete rule name=\"{rule_name}\""
        subprocess.run(command, shell=True)
        print("TCP Flood mitigation removed.")

    # macOS methods
    def mitigate_tcp_flood_macos(self):
        print("Deploying TCP Flood mitigation on macOS...")
        rule = f"block drop in log quick proto tcp from {self.src_address}"
        self.add_pf_rule(rule)
        print(f"TCP packets from {self.src_address} are now blocked.")

    def remove_tcp_flood_macos(self):
        print("Removing TCP Flood mitigation on macOS...")
        rule = f"block drop in log quick proto tcp from {self.src_address}"
        self.remove_pf_rule(rule)
        print("TCP Flood mitigation removed.")
    
    # Helper methods for macOS
    def add_pf_rule(self, rule):
        subprocess.run("sudo cp /etc/pf.conf /etc/pf.conf.backup", shell=True)
        with open('/etc/pf.conf', 'a') as pf_conf:
            pf_conf.write('\n' + rule + '\n')
        subprocess.run("sudo pfctl -f /etc/pf.conf", shell=True)
        subprocess.run("sudo pfctl -E", shell=True)

    def remove_pf_rule(self, rule):
        subprocess.run("sudo cp /etc/pf.conf /etc/pf.conf.backup", shell=True)
        with open('/etc/pf.conf', 'r') as pf_conf:
            lines = pf_conf.readlines()
        with open('/etc/pf.conf', 'w') as pf_conf:
            for line in lines:
                if line.strip() != rule.strip():
                    pf_conf.write(line)
        subprocess.run("sudo pfctl -f /etc/pf.conf", shell=True)