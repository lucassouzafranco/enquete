from flask import Flask, request, jsonify
from uuid import uuid4
from datetime import datetime
import json
import os
from pathlib import Path
from dotenv import load_dotenv
import pika

# Carrega variáveis de ambiente
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

NODE_NAME = os.getenv("NODE_NAME", "NODE_001")


from publish import publish_message
app = Flask(__name__)

POKEMON_MAP = {
    1: "bulbasaur",
    4: "charmander",
    7: "squirtle",
    25: "pikachu",
    133: "eevee"
}

@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.get_json()
    print("DATA", data)
    try:
        data = request.get_json()

        if not data or 'pokemon_id' not in data:
            return jsonify({"error": "Missing 'pokemon_id' in request"}), 400

        pokemon_id = data['pokemon_id']

        if pokemon_id not in POKEMON_MAP:
            return jsonify({"error": "Invalid or unsupported Pokémon ID"}), 400

        pokemon_name = POKEMON_MAP[pokemon_id]

        result = {
            "batchId": str(uuid4()),
            "sourceNodeId": NODE_NAME,
            "dataPoints": [
                {
                    "type": "pokemon",
                    "objectIdentifier": pokemon_name,
                    "valor": 1.0,
                    "datetime": datetime.utcnow().isoformat()
                }
            ]
        }

        publish_message('queue_agregador', json.dumps(result))
        return jsonify({"status": "Message sent to RabbitMQ", "data": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
