import os
from pathlib import Path
from dotenv import load_dotenv
import pika

# Carrega variáveis de ambiente
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

RABBITMQ_HOST = os.getenv("AGREGRADOR_QUEUE_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("AGREGRADOR_QUEUE_PORT", 5672))
RABBITMQ_USER = os.getenv("AGREGRADOR_QUEUE_USER", "guest")
RABBITMQ_PASS = os.getenv("AGREGRADOR_QUEUE_PASS", "guest")
RABBITMQ_QUEUE = os.getenv("AGREGRADOR_QUEUE_NAME", "fila_agregador")


def publish_message(queue_name: str, message: str):
    print(f"CREDENCIAIS:{RABBITMQ_HOST}, {RABBITMQ_PORT}, \nMENSAGEM:\n",message, flush=True)

    connection_params = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    )

    try:
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()

        channel.queue_declare(queue=queue_name, durable=True)

        channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2  # Mensagens persistentes
            )
        )

    except pika.exceptions.AMQPConnectionError as e:
        print("Erro ao conectar ao RabbitMQ:", e)

    finally:
        if 'connection' in locals() and connection.is_open:
            connection.close()


if __name__ == "__main__":
    for i in range(0, 1000):
        publish_message(RABBITMQ_QUEUE, str(i))
