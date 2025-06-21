import pika
import json
import os
import time
from dotenv import load_dotenv
from pathlib import Path
from core_connection import send_to_core
from db import incrementa_candidato

# Carrega variáveis de ambiente do .env no root do projeto
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

RABBITMQ_HOST = os.getenv("AGREGRADOR_QUEUE_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("AGREGRADOR_QUEUE_PORT", 5672))
RABBITMQ_QUEUE = os.getenv("AGREGRADOR_QUEUE_NAME", "fila_agregador")


def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        #Salva no DB
        data_points = data.get("dataPoints", [])

        if not data_points:
            print("[WARN] Nenhum voto encontrado em dataPoints")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return


        for vote in data_points:
            candidate_id = vote.get("objectIdentifier")
            if candidate_id:
                # incrementa_candidato(candidate_id)
                send_to_core(data)
                ch.basic_ack(delivery_tag=method.delivery_tag)  #Ack manual

                print(f"[INFO] Voto registrado para {candidate_id}")
            else:
                print("[WARN] objectIdentifier ausente em um dataPoint")

    except Exception as e:
        print(f"Error processing message: {e}")


def start_consumer():
    while True:
        try:
            print(f"[INFO] Tentando conectar ao RabbitMQ em {RABBITMQ_HOST}:{RABBITMQ_PORT}...")
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT)
            )
            channel = connection.channel()
            channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

            print(f"[*] Conectado! Aguardando mensagens na fila '{RABBITMQ_QUEUE}'...")
            channel.basic_consume(
                queue=RABBITMQ_QUEUE,
                on_message_callback=callback,
                auto_ack=False
            )

            channel.start_consuming()


        except pika.exceptions.AMQPConnectionError as e:
            print(f"[ERRO] Conexão com RabbitMQ falhou: {e}", flush=True)
            print("[INFO] Tentando novamente em 5 segundos...", flush=True)
            time.sleep(5)
        except Exception as e:
            print(f"[ERRO] Erro inesperado: {e}", flush=True)
            print("[INFO] Tentando novamente em 5 segundos...", flush=True)
            time.sleep(5)


if __name__ == '__main__':
    # print(f"{RABBITMQ_HOST}, {RABBITMQ_PORT}, {RABBITMQ_QUEUE}")
    start_consumer()
