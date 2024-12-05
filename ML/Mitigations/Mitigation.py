class Mitigation:
    def __init__(self, src_address, dst_address, system):
        self.src_address = src_address
        self.dst_address = dst_address
        self.system = system

    def deploy_mitigation(self):
        raise NotImplementedError("This method should be overridden by subclasses.")

    def remove_mitigation(self):
        raise NotImplementedError("This method should be overridden by subclasses.")


