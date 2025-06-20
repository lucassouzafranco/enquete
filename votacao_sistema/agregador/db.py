import json
import os
import time

#Implementar a lógica de db depois para criar persistencia

DATA_FILE = "data.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    else:
        return {
            "batchId": "VOTOS_001",
            "sourceNodeId": "URNA ALPHA",
            "dataPoints": []
        }

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

def incrementa_candidato(candidate_id):
    data = load_data()
    for dp in data["dataPoints"]:
        if dp["objectIdentifier"] == candidate_id:
            dp["valor"] += 1
            break
    else:
        data["dataPoints"].append({
            "type": "votacao",
            "objectIdentifier": candidate_id,
            "valor": 1,
            "datetime": int(time.time() * 1000)
        })

    save_data(data)
    print(f"Updated vote count for {candidate_id}")

if __name__ == "__main__":
    incrementa_candidato("CANDIDATO_A")
    incrementa_candidato("CANDIDATO_B")
