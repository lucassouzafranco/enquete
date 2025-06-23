#!/bin/bash
STACK_NAME="votacao_stack"
echo "Buildando as imagens"
docker-compose build
echo "Fazendo o deploy"
docker stack deploy -c docker-compose.yml $STACK_NAME
echo "Status:"
docker stack services $STACK_NAME
