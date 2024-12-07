from flask import Flask, request, jsonify
from TcpFlood import TcpFloodMitigation
from UdpFlood import UdpFloodMitigation
from GetFlood import GetFloodMitigation
from flask_cors import CORS

# Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Global variables
MITIGATION = None
MITIGATION_STATUS = "bad"

# Routes

@app.route('/')
def home():
    return "Welcome to the Mitigations API!"

@app.route('/mitigate/tcp', methods=['POST'])
def tcp():
    try:
        global MITIGATION
        global MITIGATION_STATUS

        data = request.get_json()
        print(data)
        try:
             MITIGATION = TcpFloodMitigation(data["src_address"], data["dst_address"], data["system"], data["port"])
        except:
            print("Could not create mitigation")
        MITIGATION.deploy_mitigation()
        MITIGATION_STATUS = "good"

        return jsonify(
            {
            'message': 'Mitigation successful!',
            'status': MITIGATION_STATUS
            }
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/udp', methods=['POST'])
def udp():
    try:
        global MITIGATION
        data = request.get_json()
        print(data)
        try:
            MITIGATION = UdpFloodMitigation(data["src_address"], data["dst_address"], data["system"], data["port"])
        except:
            print("Could not create mitigation")
        print("Deploying mitigation")
        MITIGATION.deploy_mitigation()
        print("Mitigation deployed")
        MITIGATION_STATUS = "good"

        return jsonify(
            {
            'message': 'Mitigation successful!',
            'status': MITIGATION_STATUS
            }
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/remove', methods=['POST'])
def deactivate():
    try:
        global MITIGATION
        MITIGATION.remove_mitigation()
        MITIGATION_STATUS = "bad"
        return jsonify({'message': 'Mitigation deactivated!', 'status': MITIGATION_STATUS})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/status', methods=['GET'])
def status():
    try:
        global MITIGATION
        return jsonify({'status': MITIGATION_STATUS})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


# Run the app

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
