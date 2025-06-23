import pika
import json
import ssl
from datetime import datetime
import uuid


#DADOS DA FILA DO CORE
# RABBITMQ_HOST = 'chimpanzee.rmq.cloudamqp.com'
# RABBITMQ_PORT = 5671
# RABBITMQ_USER = 'edxgujmk'
# RABBITMQ_PASSWORD = 'Wm1vy2ea99LIfZh-ZZyl3DhWlLDlNcdH'
# RABBITMQ_VHOST = 'edxgujmk'
# QUEUE_NAME = 'lotes_de_dados'

#DAGOS DA FILA DE DEBUG
RABBITMQ_HOST = '45.178.181.110'
RABBITMQ_PORT = 5672
RABBITMQ_USER = 'new_user'
RABBITMQ_VHOST = '/'

RABBITMQ_PASSWORD = 'pass'
QUEUE_NAME = 'debug'


def send(data):
    ssl_context = ssl.create_default_context()

    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        virtual_host=RABBITMQ_VHOST,
        credentials=credentials,
        # ssl_options=pika.SSLOptions(ssl_context) #DESCOMENTAR EM PRODUÇÃO
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

    print("Mensagem enviada com sucesso.")
    connection.close()

if __name__ == "__main__":
    example_data = {
        "batchId": str(uuid.uuid4()),
        "sourceNodeId": "NODE_001",
        "dataPoints": [
            {
                "type": "votacao_teste_thales",
                "objectIdentifier": "Romário",
                "valor": 100.0,
                "datetime": datetime.utcnow().isoformat()
            }
        ]
    }

    send(example_data)
