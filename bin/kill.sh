#!/bin/bash
# Kills the web server if it is running.

set -e

source "$( dirname "$0" )/share.sh"

[ -f "$PIDFILE" ] || exit 1
pid="$( cat "$PIDFILE" )"
[ -z "$pid" ] && exit 1
gid="$( ps -o pgid= "$pid" | awk '{ print $1 }' )"
[ -z "$gid" ] && exit 1

kill -- -"$gid"
echo > "$PIDFILE"
log "Killed previously running server"
exit 0
