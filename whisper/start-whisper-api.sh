#!/bin/bash

# Whisper konténer konfiguráció
IMAGE="onerahmet/openai-whisper-asr-webservice"
CONTAINER_NAME="whipser-api"
PORT=7000
MODEL="small"  # lehet: tiny, base, small, medium, large

echo "===> Whisper API indítása: modell=$MODEL, port=$PORT"

# Ha fut már a konténer, leállítjuk és eltávolítjuk
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "===> Létező konténer leállítása..."
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi

# Konténer indítása
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:9000 \
  -e ASR_MODEL=$MODEL \
  -e ASR_ENGINE=faster-whisper \
  $IMAGE

echo "===> Whisper API fut a http://localhost:$PORT/asr címen"
