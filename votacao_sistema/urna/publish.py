import pika

def publish_message(queue_name: str, message: str):

    connection_params = pika.ConnectionParameters(
        host='localhost',  # substituir
        port=5672,
        credentials=pika.PlainCredentials('guest', 'guest')
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
                delivery_mode=2 
            )
        )

    except pika.exceptions.AMQPConnectionError as e:
        print("Erro ao conectar ao RabbitMQ:", e)

    finally:
        if 'connection' in locals() and connection.is_open:
            connection.close()

if __name__ == "__main__":
    for i in range(0, 1000):
        publish_message('test_queue', str(i))

