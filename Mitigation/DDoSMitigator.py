from flask import Flask, request, jsonify
from functools import wraps
import time

class DDoSMitigator:
    def __init__(self):
        # Rate limiting configuration
        self.requests_per_minute = 30
        self.ip_rate_limit = {}

        # Connection limit per IP (TCP/SYN Flood mitigation)
        self.connection_limit = 10
        self.connection_window = 60  # Time window in seconds
        self.ip_connections = {}

    # Rate Limiting (HTTP Flood Protection)
    def rate_limit(self):
        def decorator(f):
            @wraps(f)
            def wrapped(*args, **kwargs):
                ip = request.remote_addr
                now = time.time()
                
                if ip not in self.ip_rate_limit:
                    self.ip_rate_limit[ip] = [now]
                else:
                    # Remove outdated requests
                    self.ip_rate_limit[ip] = [timestamp for timestamp in self.ip_rate_limit[ip] if now - timestamp < 60]
                    self.ip_rate_limit[ip].append(now)

                # Check if IP exceeded rate limit
                if len(self.ip_rate_limit[ip]) > self.requests_per_minute:
                    return jsonify({"error": "Too many requests"}), 429
                
                return f(*args, **kwargs)
            return wrapped
        return decorator

    # Connection Filtering (SYN/TCP Flood Protection)
    def connection_filter(self):
        def decorator(f):
            @wraps(f)
            def wrapped(*args, **kwargs):
                ip = request.remote_addr
                now = time.time()

                if ip not in self.ip_connections:
                    self.ip_connections[ip] = [now]
                else:
                    # Reset counter if the time window has passed
                    self.ip_connections[ip] = [timestamp for timestamp in self.ip_connections[ip] if now - timestamp < self.connection_window]
                    self.ip_connections[ip].append(now)

                # Check if IP exceeded connection limit
                if len(self.ip_connections[ip]) > self.connection_limit:
                    return jsonify({"error": "Too many connections"}), 429
                
                return f(*args, **kwargs)
            return wrapped
        return decorator

    # Placeholder CAPTCHA Check
    def captcha_check(self):
        def decorator(f):
            @wraps(f)
            def wrapped(*args, **kwargs):
                is_human = True  # Replace with actual CAPTCHA validation
                if not is_human:
                    return jsonify({"error": "CAPTCHA validation failed"}), 403
                return f(*args, **kwargs)
            return wrapped
        return decorator

    # Apply all mitigations as middleware
    def apply_mitigations(self, func):
        @self.captcha_check()
        @self.connection_filter()
        @self.rate_limit()
        @wraps(func)
        def wrapped(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapped

# Initialize the Flask app and DDoS mitigator
app = Flask(__name__)
ddos_mitigator = DDoSMitigator()

# Define routes with DDoS protections
@app.route('/')
@ddos_mitigator.apply_mitigations
def index():
    return jsonify({"message": "Welcome to the protected route!"})

@app.route('/login')
@ddos_mitigator.apply_mitigations
def login():
    return jsonify({"message": "Login route with DDoS protection"})

# Start the app
if __name__ == '__main__':
    app.run(port=5000)
