from datetime import datetime

def criar_payload_voto(nome_candidato: str) -> dict:
    return {
        "type": "votacao_api",
        "object": nome_candidato,
        "valor": 1,
        "datetime": int(datetime.utcnow().timestamp())
    }
