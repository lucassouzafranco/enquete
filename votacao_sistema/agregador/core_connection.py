import os
from dotenv import load_dotenv
from pathlib import Path
import requests

# Carrega variáveis de ambiente do .env no root do projeto
env_path = Path(__file__).resolve().parents[2] / '.env'
load_dotenv(dotenv_path=env_path)
CORE_IP = os.getenv('CORE_IP')
CORE_POST_ROUTE = os.getenv('CORE_POST_ROUTE')

if not CORE_IP:
    raise EnvironmentError("Variável de ambiente CORE_IP não definida corretamente!")
if not CORE_POST_ROUTE:
    raise EnvironmentError("Variável de ambiente CORE_POST_ROUTE não definida corretamente!")

def send_to_core(data: dict):
    url = f"http://{CORE_IP}/{CORE_POST_ROUTE}"
    try:
        response = requests.post(url, json=data)
        print("Status Code:", response.status_code)
        print("Response Body:", response.text)
        return response
    except requests.RequestException as e:
        print("Erro ao enviar dados ao core:", e)
        raise


if __name__ == "__main__":
    test_data = {
        "batchId": "VOTOS_001",
        "sourceNodeId": "URNA ALPHA",
        "dataPoints": [
            {"type": "votacao", "objectIdentifier": "CANDIDADO_A", "valor": 1, "datetime": 1700000001000},
            {"type": "votacao", "objectIdentifier": "CANDIDADO_B", "valor": 1, "datetime": 1700000002000},
            {"type": "votacao", "objectIdentifier": "CANDIDADO_C", "valor": 1, "datetime": 1700000003000}
        ]
    }

    send_to_core(test_data)
