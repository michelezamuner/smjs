#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"

readonly id="$1"
readonly result1="$2"
readonly result2="$3"

${SM_ROOT}/bin/application/api-gateway >/dev/null 2>&1 & disown
sleep 1

readonly results="$(${node} ${current}/results-client.js ${id})"

ps aux | grep '[a]pi-gateway' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 printf 'Failed killing API gateway process'
    exit 1
fi

if [[ -n "$(ps aux | grep '[r]esults-client.js')" ]]; then
    >&2 printf 'Client process not terminated'
    exit 1
fi

readonly expected="${result1}${result2}"
if [[ "${results}" != "${expected}" ]]; then
    >&2 printf "Wrong results: expected '${expected}', got '${results}'"
    exit 1
fi
