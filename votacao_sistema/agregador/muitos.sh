#!/bin/bash

URL="45.178.181.60:5000/submit"
#URL="localhost:5000/submit" 
HEADERS="Content-Type: application/json"
#POKEMON_IDS=(1 4 7 25 133)
POKEMON_IDS=(25)

for i in {1..50}
do
  RANDOM_ID=$(shuf -e "${POKEMON_IDS[@]}" -n 1)
  DATA="{\"pokemon_id\": $RANDOM_ID}"
  
  echo "Sending request #$i with pokemon_id=$RANDOM_ID"
  curl -s -o /dev/null -X POST "$URL" -H "$HEADERS" -d "$DATA"
done


