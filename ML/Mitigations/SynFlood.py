from Mitigation import Mitigation
import subprocess

class SynFloodMitigation(Mitigation):
    def deploy_mitigation(self):
        if self.system == "Linux":
            self.mitigate_syn_flood_linux()
        elif self.system == "Windows":
            self.mitigate_syn_flood_windows()
        elif self.system == "Darwin":
            self.mitigate_syn_flood_macos()
        else:
            print("SYN Flood mitigation is not supported on this OS.")

    def remove_mitigation(self):
        if self.system == "Linux":
            self.remove_syn_flood_linux()
        elif self.system == "Windows":
            self.remove_syn_flood_windows()
        elif self.system == "Darwin":
            self.remove_syn_flood_macos()
        else:
            print("SYN Flood mitigation removal is not supported on this OS.")

    # Linux methods
    def mitigate_syn_flood_linux(self):
        print("Deploying SYN Flood mitigation on Linux...")
        command = f"iptables -A INPUT -p tcp --syn -s {self.src_address} -j DROP"
        subprocess.run(command, shell=True)
        print(f"SYN packets from {self.src_address} are now blocked.")

    def remove_syn_flood_linux(self):
        print("Removing SYN Flood mitigation on Linux...")
        command = f"iptables -D INPUT -p tcp --syn -s {self.src_address} -j DROP"
        subprocess.run(command, shell=True)
        print("SYN Flood mitigation removed.")

    # Windows methods
    def mitigate_syn_flood_windows(self):
        print("Deploying SYN Flood mitigation on Windows...")
        rule_name = f"SYN Flood Block {self.src_address}"
        command = f"netsh advfirewall firewall add rule name=\"{rule_name}\" dir=in action=block protocol=TCP remoteip={self.src_address}"
        subprocess.run(command, shell=True)
        print(f"SYN packets from {self.src_address} are now blocked.")

    def remove_syn_flood_windows(self):
        print("Removing SYN Flood mitigation on Windows...")
        rule_name = f"SYN Flood Block {self.src_address}"
        command = f"netsh advfirewall firewall delete rule name=\"{rule_name}\""
        subprocess.run(command, shell=True)
        print("SYN Flood mitigation removed.")

    # macOS methods
    def mitigate_syn_flood_macos(self):
        print("Deploying SYN Flood mitigation on macOS...")
        rule = f"block drop in log quick proto tcp from {self.src_address}"
        self.add_pf_rule(rule)
        print(f"SYN packets from {self.src_address} are now blocked.")

    def remove_syn_flood_macos(self):
        print("Removing SYN Flood mitigation on macOS...")
        rule = f"block drop in log quick proto tcp from {self.src_address}"
        self.remove_pf_rule(rule)
        print("SYN Flood mitigation removed.")

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