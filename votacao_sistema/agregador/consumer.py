import pika
import json
from shared.config import RABBITMQ_HOST, RABBITMQ_QUEUE
from agregador.validator import validar_voto

from agregador.producer_to_core import enviar_para_core

def callback(ch, method, properties, body):
    mensagem = json.loads(body)
    print("[>] Mensagem recebida:", mensagem)

    if validar_voto(mensagem):
        print("[✓] Voto válido, enviando ao core...")
        enviar_para_core(mensagem)
    else:
        print("[x] Voto inválido, descartando.")

    ch.basic_ack(delivery_tag=method.delivery_tag)

def consumir_votos():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()

    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=RABBITMQ_QUEUE, on_message_callback=callback)

    print('[*] Aguardando mensagens. Para sair, CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    consumir_votos()
