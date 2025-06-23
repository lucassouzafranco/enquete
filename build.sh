#!/bin/bash

STACK_NAME="votacao_stack"

echo "Buildando as imagens"
docker build -t urna_service:latest ./votacao_sistema/urna
docker build -t agregador_service:latest ./votacao_sistema/agregador

echo "Fazendo o deploy"
docker stack deploy -c docker-compose.yml $STACK_NAME

echo "Status:"
docker stack services $STACK_NAME
