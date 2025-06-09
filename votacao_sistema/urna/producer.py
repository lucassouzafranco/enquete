import pika
import json
from shared.config import RABBITMQ_HOST, RABBITMQ_QUEUE
from urna.payloads import criar_payload_voto

def enviar_voto(candidato_nome: str):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()

    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

    payload = criar_payload_voto(candidato_nome)
    mensagem = json.dumps(payload)

    channel.basic_publish(
        exchange='',
        routing_key=RABBITMQ_QUEUE,
        body=mensagem,
        properties=pika.BasicProperties(delivery_mode=2)
    )

    print(f"[x] Voto enviado: {mensagem}")
    connection.close()

# Teste local
if __name__ == '__main__':
    enviar_voto("candidato_exemplo")
