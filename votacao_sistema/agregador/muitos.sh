#!/bin/bash

URL="http://localhost:5000/submit"
HEADERS="Content-Type: application/json"
POKEMON_IDS=(1 4 7 25 133)

for i in {1..10000}
do
  RANDOM_ID=$(shuf -e "${POKEMON_IDS[@]}" -n 1)
  DATA="{\"pokemon_id\": $RANDOM_ID}"
  
  echo "Sending request #$i with pokemon_id=$RANDOM_ID"
  curl -s -o /dev/null -X POST "$URL" -H "$HEADERS" -d "$DATA"
done

echo "Finished sending 10,000 requests."

