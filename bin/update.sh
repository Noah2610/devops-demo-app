#!/bin/bash
# Updates the repository, builds the app, and re-starts it.

set -e

source "$( dirname "$0" )/share.sh"

cd "$ROOT"

"${ROOT}/bin/kill.sh" && true

{
    echo "Pulling changes"
    git pull
} 2>&1 | log

{
    echo "Updating dependencies"
    npm install
} 2>&1 | log

{
    echo "Building"
    npm run build
} 2>&1 | log

"${ROOT}/bin/start.sh"
