import requests

CORE_URL = "http://localhost:8000/voto"  # ajuste conforme porta do serviço core

def enviar_para_core(voto: dict):
    try:
        response = requests.post(CORE_URL, json=voto)
        if response.status_code == 200:
            print("[→] Voto enviado com sucesso ao core.")
        else:
            print(f"[!] Erro ao enviar voto ao core. Status: {response.status_code}")
            print("Resposta:", response.text)
    except Exception as e:
        print(f"[x] Falha na conexão com o core: {e}")
