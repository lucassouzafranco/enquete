import json
from datetime import datetime

def generate_payload(id: int) -> str:
    payload = {
        "type": "votacao_api",
        "object": id,
        "valor": 1.0,
        "cod": "MG",
        "datetime": datetime.utcnow().isoformat() + "Z"  # UTC timestamp
    }

    # Return the payload as a formatted JSON string
    return json.dumps(payload, ensure_ascii=False, indent=2)

