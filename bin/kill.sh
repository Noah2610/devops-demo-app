#!/bin/bash
# Kills the web server if it is running.

set -e

source "$( dirname "$0" )/share.sh"

if [ -f "$PIDFILE" ]; then
    pid="$( cat "$PIDFILE" )"
    if [ -n "$pid" ]; then
        kill "$pid"
        echo > "$PIDFILE"
        log "Killed previously running server"
        exit 0
    fi
fi

log "No server running"
exit 1
