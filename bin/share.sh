ROOT="$( cd "$( dirname "$0" )/.." && pwd )"
PIDFILE="${ROOT}/.server-pid"
LOGFILE="${ROOT}/log/server.log"

mkdir -p "$( dirname "$PIDFILE" )"
mkdir -p "$( dirname "$LOGFILE" )"

function log {
    local msg="$1"
    [ -z "$msg" ] && msg="$(< /dev/stdin)"

    echo -e "[$( date +'%F %X' )] ${msg}" \
        | tee -a "$LOGFILE"
}
