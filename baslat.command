#!/bin/bash
# ANKU EEE Materials - yerel başlatıcı
# Siteyi http://localhost üzerinden açar (YouTube videolarının oynaması için gerekli).
cd "$(dirname "$0")"
PORT=8765
( sleep 1 && open "http://localhost:$PORT/index.html" ) &
echo "ANKU EEE Materials çalışıyor: http://localhost:$PORT"
echo "Kapatmak için bu pencereyi kapatın veya Ctrl+C'ye basın."
python3 -m http.server $PORT
