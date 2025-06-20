#!/bin/bash
sudo docker network create new_network
sudo docker run -d --name rabbitmq --network new_network -p 5672:5672 -p 15672:15672 rabbitmq:3-management
sudo docker build -t agregador:latest .
sudo docker run -d --name agregador --network new_network agregador:latest
