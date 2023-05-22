#!/bin/bash
# Starts the web server in the background.

set -e

source "$( dirname "$0" )/share.sh"

"${ROOT}/bin/kill.sh" && true

cd "$ROOT"

log "Starting server"
npm run start &>> "$LOGFILE" &

pid="$!"
echo "$pid" > "$PIDFILE"
