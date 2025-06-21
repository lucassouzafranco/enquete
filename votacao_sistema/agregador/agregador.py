import time
import threading
from consume import read_message_from_queue  # Assuming consume.py contains read_message_from_queue

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
        time.sleep(poll_interval)

def print_aggregated_data(interval=5):
    while True:
        time.sleep(interval)
        with lock:
            print("\nDADOS AGREGADOS:\n")
            print(list(aggregated_data.values()))

if __name__ == "__main__":
    printer_thread = threading.Thread(target=print_aggregated_data, daemon=True)
    printer_thread.start()

    continuously_read_queue()
