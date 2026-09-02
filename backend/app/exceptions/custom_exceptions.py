class EmailAlreadyExistsException(Exception):
    def __init__(self):
        self.message = "Email is already registered."
        super().__init__(self.message)