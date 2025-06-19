import pika
import sys

def consume_messages(queue_name: str, queue_ip : str):
    connection_params = pika.ConnectionParameters(
        host=queue_ip,
        port=5672,
        credentials=pika.PlainCredentials('guest', 'guest')
    )

    connection = pika.BlockingConnection(connection_params)
    channel = connection.channel()

    channel.queue_declare(queue=queue_name, durable=True)

    def callback(ch, method, properties, body):
        print(body.decode())
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue=queue_name, on_message_callback=callback)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Saindo\n")
        channel.stop_consuming()
    finally:
        connection.close()

if __name__ == "__main__":
    if len(sys.argv) >= 2:
        print("Escutando fila em", sys.argv[1])
        consume_messages('votacao_api', sys.argv[1])

    else:
        print("Escutando fila em localhost")
        consume_messages('votacao_api', 'localhost')


