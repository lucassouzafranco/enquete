sudo docker network create new_network
sudo docker build -t mini_core .
sudo docker run --network new_network -p 5000:5000 mini_core
