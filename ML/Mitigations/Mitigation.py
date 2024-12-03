class Mitigation:
    def __init__(self, src_address, dst_address, system):
        self.src_address = src_address
        self.dst_address = dst_address
        self.system = system

    def deploy_mitigation(self):
        raise NotImplementedError("This method should be overridden by subclasses.")

    def remove_mitigation(self):
        raise NotImplementedError("This method should be overridden by subclasses.")


# this logic can be implemented before the mitigation is applied.

    # def define_attack(self, number):
    #     if number == 0:
    #         return "HTTP-FLOOD"
    #     elif number == 1:
    #         return "Normal"
    #     elif number == 2:
    #         return "SYN-FLOOD"
    #     elif number == 3:
    #         return "Smurf"
    #     elif number == 4:
    #         return "TCP-FLOOD"
    #     elif number == 5:
    #         return "UDP-FLOOD"
    #     else:
    #         return "Unknown"