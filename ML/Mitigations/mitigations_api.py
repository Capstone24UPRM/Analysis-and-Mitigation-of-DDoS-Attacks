from flask import Flask, request, jsonify
from TcpFlood import TcpFloodMitigation
from UdpFlood import UdpFloodMitigation
from HttpFlood import HttpFloodMitigation

app = Flask(__name__)

mitigation = None

@app.route('/')
def home():
    return "Welcome to the Flask API!"

@app.route('/mitigate/tcp', methods=['POST'])
def tcp():
    try:
        global mitigation
        data = request.get_json()
        
        mitigation = TcpFloodMitigation(src_address=data.src_address, dst_address=data.dst_address, system=data.system)

        mitigation.deploy_mitigation()

        return jsonify({'message': 'Mitigation successful!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/udp', methods=['POST'])
def udp():
    try:
        global mitigation
        data = request.get_json()
        
        mitigation = UdpFloodMitigation(src_address=data.src_address, dst_address=data.dst_address, system=data.system)

        mitigation.deploy_mitigation()

        return jsonify({'message': 'Mitigation successful!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mitigate/http', methods=['POST'])
def http():
    try:
        global mitigation
        data = request.get_json()
        
        mitigation = HttpFloodMitigation(src_address=data.src_address, dst_address=data.dst_address, system=data.system)

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
