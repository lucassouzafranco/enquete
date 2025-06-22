import os
import json
from pathlib import Path
from dotenv import load_dotenv
import pika

# Carrega variáveis de ambiente
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

RABBITMQ_HOST = os.getenv("AGREGADOR_QUEUE_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("AGREGADOR_QUEUE_PORT", 5672))
RABBITMQ_USER = os.getenv("AGREGADOR_QUEUE_USER", "guest")
RABBITMQ_PASS = os.getenv("AGREGADOR_QUEUE_PASS", "guest")
RABBITMQ_QUEUE = os.getenv("AGREGADOR_QUEUE_NAME", "fila_agregador")

def read_message_from_queue():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials
    )
    
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    method_frame, header_frame, body = channel.basic_get(queue=RABBITMQ_QUEUE, auto_ack=True)

    if method_frame:
        try:
            message = json.loads(body)
            # print("Received JSON message:", message)  # Debug print
            return message
        except json.JSONDecodeError:
            print("Failed to decode JSON:", body)
            return None
    else:
        print("No message in queue.", flush=True)
        return None

# Example usage
if __name__ == "__main__":
    data = read_message_from_queue()
