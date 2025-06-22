import time
import threading
from datetime import datetime
import uuid

from consume import read_message_from_queue  # Your custom queue reader
from send_to_core import send  # Import the send function

aggregated_data = {}
lock = threading.Lock()

def continuously_read_queue(poll_interval=0.001):
    while True:
        message = read_message_from_queue()
        if message and 'dataPoints' in message:
            with lock:
                for dp in message['dataPoints']:
                    obj_id = dp['objectIdentifier']
                    if obj_id not in aggregated_data:
                        aggregated_data[obj_id] = dp.copy()
                    else:
                        aggregated_data[obj_id]['valor'] += dp.get('valor', 0.0)
                        aggregated_data[obj_id]['datetime'] = datetime.utcnow().isoformat()
        time.sleep(poll_interval)

def send_aggregated_data(interval=5):
    while True:
        time.sleep(interval)
        with lock:
            if not aggregated_data:
                continue

            # Format the data as expected by send()
            batch = {
                "batchId": str(uuid.uuid4()),
                "sourceNodeId": "NODE_001",
                "dataPoints": []
            }

            for dp in aggregated_data.values():
                batch['dataPoints'].append({
                    "type": "pokemon",
                    "objectIdentifier": dp['objectIdentifier'],
                    "valor": dp['valor'],
                    "datetime": datetime.utcnow().isoformat()
                })

            print("\nDADOS AGREGADOS (enviando):\n", flush=True)
            # print(batch['dataPoints'], flush=True)
            print(batch, flush=True)
            # Send the batch
            send(batch)
            aggregated_data.clear()


if __name__ == "__main__":
    sender_thread = threading.Thread(target=send_aggregated_data, daemon=True)
    sender_thread.start()

    continuously_read_queue()
