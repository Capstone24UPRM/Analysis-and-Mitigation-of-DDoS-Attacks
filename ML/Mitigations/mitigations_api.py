from flask import Flask, request, jsonify
from TcpFlood import TcpFloodMitigation
from UdpFlood import UdpFloodMitigation
from GetFlood import GetFloodMitigation
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
mitigation = None

@app.route('/')
def home():
    return "Welcome to the Mitigations API!"

@app.route('/mitigate/get', methods=['POST'])
def get():
    try:
        global mitigation
        data = request.get_json()
        print(data)
        try:
             mitigation = GetFloodMitigation(data["src_address"], data["dst_address"], data["system"]) 
        except:
            print("Could not create mitigation")
        mitigation.deploy_mitigation()

        return jsonify({'message': 'Mitigation successful!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/tcp', methods=['POST'])
def tcp():
    try:
        global mitigation
        data = request.get_json()
        print(data)
        try:
             mitigation = TcpFloodMitigation(data["src_address"], data["dst_address"], data["system"])
        except:
            print("Could not create mitigation")
        mitigation.deploy_mitigation()

        return jsonify({'message': 'Mitigation successful!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/udp', methods=['POST'])
def udp():
    try:
        global mitigation
        data = request.get_json()
        try:
            mitigation = UdpFloodMitigation(data["src_address"], data["dst_address"], data["system"])
        except:
            print("Could not create mitigation")
        mitigation.deploy_mitigation()

        return jsonify({'message': 'Mitigation successful!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/http', methods=['POST'])
def http():
    try:
        global mitigation
        data = request.get_json()
        try:
            mitigation = HttpFloodMitigation(data["src_address"], data["dst_address"], data["system"])
        except:
            print("Could not create mitigation")

        mitigation.deploy_mitigation()

        return jsonify({'message': 'Mitigation successful!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/remove', methods=['POST'])
def deactivate():
    try:
        global mitigation
        mitigation.remove_mitigation()
        return jsonify({'message': 'Mitigation deactivated!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
