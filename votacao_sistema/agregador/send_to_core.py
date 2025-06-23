import pika
import json
import ssl
from datetime import datetime
import uuid


#FILA DO CORE
RABBITMQ_HOST = 'chimpanzee.rmq.cloudamqp.com'
RABBITMQ_PORT = 5671
RABBITMQ_USER = 'edxgujmk'
RABBITMQ_PASSWORD = 'Wm1vy2ea99LIfZh-ZZyl3DhWlLDlNcdH'
RABBITMQ_VHOST = 'edxgujmk'
QUEUE_NAME = 'lotes_de_dados'

#FILA DE DEBUG
DEBUG_RABBITMQ_HOST = '45.178.181.110'
DEBUG_RABBITMQ_PORT = 5672
DEBUG_RABBITMQ_USER = 'new_user'
DEBUG_RABBITMQ_PASSWORD = 'pass'
DEBUG_RABBITMQ_VHOST = '/'
DEBUG_QUEUE_NAME = 'debug'


def send(data):
    ssl_context = ssl.create_default_context()

    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        virtual_host=RABBITMQ_VHOST,
        credentials=credentials,
        ssl_options=pika.SSLOptions(ssl_context)  # SSL enabled
    )

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.queue_declare(queue=QUEUE_NAME, durable=True)

    message = json.dumps(data)
    channel.basic_publish(
        exchange='',
        routing_key=QUEUE_NAME,
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )

    print("Mensagem enviada com sucesso para a fila do core.")
    connection.close()


def send_debug(data):
    credentials = pika.PlainCredentials(DEBUG_RABBITMQ_USER, DEBUG_RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=DEBUG_RABBITMQ_HOST,
        port=DEBUG_RABBITMQ_PORT,
        virtual_host=DEBUG_RABBITMQ_VHOST,
        credentials=credentials,
        ssl_options=None 
    )

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.queue_declare(queue=DEBUG_QUEUE_NAME, durable=True)

    message = json.dumps(data)
    channel.basic_publish(
        exchange='',
        routing_key=DEBUG_QUEUE_NAME,
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2 
        )
    )

    print("Mensagem enviada com sucesso para a fila de debug.")
    connection.close()

