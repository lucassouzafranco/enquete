import pika
import json
import os
from dotenv import load_dotenv
from pathlib import Path
import time

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

RABBITMQ_HOST = os.getenv("AGREGRADOR_QUEUE_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("AGREGRADOR_QUEUE_PORT", 5672))
RABBITMQ_QUEUE = os.getenv("AGREGRADOR_QUEUE_NAME", "fila_agregador")

test_data = {
    "batchId": "VOTOS_001",
    "sourceNodeId": "URNA ALPHA",
    "dataPoints": [
        {"type": "votacao", "objectIdentifier": "CANDIDATO_A", "valor": 1, "datetime": 1700000001000},
        {"type": "votacao", "objectIdentifier": "CANDIDATO_B", "valor": 1, "datetime": 1700000002000},
        {"type": "votacao", "objectIdentifier": "CANDIDATO_C", "valor": 1, "datetime": 1700000003000}
    ]
}

def publish_messages():
    # Setup connection to RabbitMQ
    connection_params = pika.ConnectionParameters(host='localhost', port=RABBITMQ_PORT)
    connection = pika.BlockingConnection(connection_params)
    channel = connection.channel()

    # Make sure the queue exists
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

    message_body = json.dumps(test_data)

    for i in range(100):
        channel.basic_publish(
            exchange='',
            routing_key=RABBITMQ_QUEUE,
            body=message_body,
            properties=pika.BasicProperties(
                delivery_mode=2  # Make message persistent
            )
        )
        print(f"Sent message {i+1}")

    connection.close()

if __name__ == "__main__":
    publish_messages()
