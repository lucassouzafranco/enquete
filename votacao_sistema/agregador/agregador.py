import time
import threading
from datetime import datetime
import uuid
from consume import read_message_from_queue 
from send_to_core import send, send_debug


#Este código utiliza o consume para coletar mensagens da fila_agregador e faz um batch com os dados.
#Os dados são envidaso com somam 10 votos ou quanto se passa 1.0 segundos

aggregated_data = {}
vote_counter = 0
lock = threading.Lock()

def continuously_read_queue(poll_interval=0.001):
    global vote_counter
    while True:
        message = read_message_from_queue()
        if message and 'dataPoints' in message:
            with lock:
                for dp in message['dataPoints']:
                    obj_id = dp['objectIdentifier']
                    valor = dp.get('valor', 0.0)
                    
                    if obj_id not in aggregated_data:
                        aggregated_data[obj_id] = dp.copy()
                    else:
                        aggregated_data[obj_id]['valor'] += valor
                        aggregated_data[obj_id]['datetime'] = datetime.utcnow().isoformat()
                    
                    vote_counter += valor
        time.sleep(poll_interval)

def send_aggregated_data(max_interval=1, vote_threshold=10):
    global vote_counter
    last_send_time = time.time()
    
    while True:
        time.sleep(0.001)
        
        with lock:
            time_since_last_send = time.time() - last_send_time
            
            if vote_counter >= vote_threshold or time_since_last_send >= max_interval:
                if not aggregated_data:
                    continue

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
                print(batch, flush=True)
                
                send(batch)
                send_debug(batch)

                aggregated_data.clear()
                vote_counter = 0
                last_send_time = time.time()


if __name__ == "__main__":
    sender_thread = threading.Thread(target=send_aggregated_data, daemon=True)
    sender_thread.start()

    continuously_read_queue()
