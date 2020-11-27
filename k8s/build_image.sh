#!/bin/sh

if [ ! -d "./code" ]; then
    mkdir ./code
fi

REVISION_ID=$(git rev-parse --short HEAD)
echo $REVISION_ID
exit
cp -af ../routes ./code/
cp -af ../util ./code/
cp -af ../*.js ./code/
cp -af ../package*.json ./code/

# docker build -t image-resizer:$REVISION_ID .
