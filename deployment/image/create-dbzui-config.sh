#!/bin/sh
# vim:sw=4:ts=4:et

set -e

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

ME=$(basename "$0")
DBZUI_CONFIG_TEMPLATE="/app/config.json"
DBZUI_CONFIG_FILE="/usr/share/nginx/html/config"

if [ ! -f "${DBZUI_CONFIG_TEMPLATE}" ]; then
    echo "${ME}: ERROR: ${DBZUI_CONFIG_TEMPLATE} is not a file or does not exist"
    exit 1
fi

# check if the file can be modified, e.g. not on a r/o filesystem
cp "${DBZUI_CONFIG_TEMPLATE}" "${DBZUI_CONFIG_FILE}" >/dev/null 2>&1 || { echo "$ME: ERROR: can not modify ${DBZUI_CONFIG_FILE} (read-only file system?)"; exit 1; }

if [ "${KAFKA_CONNECT_CLUSTERS}" == "http://localhost:8083" ] ; then
  ## nothing to do, keep the default config
  exit 0
fi

# escaping slashes
KAFKA_CONNECT_CLUSTERS_ESCAPED=`echo ${KAFKA_CONNECT_CLUSTERS} | sed -e 's;\/;\\\/;g'`
sed -i "s/http:\/\/localhost:8083/${KAFKA_CONNECT_CLUSTERS_ESCAPED}/g" "${DBZUI_CONFIG_FILE}"

exit 0
