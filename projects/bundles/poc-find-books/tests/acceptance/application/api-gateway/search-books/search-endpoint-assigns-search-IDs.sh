#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"

readonly search1="$1"
readonly search2="$2"
readonly id1="$3"
readonly id2="$4"

${SM_ROOT}/bin/application/api-gateway >/dev/null 2>&1 & disown
sleep 1

readonly output1="$(${node} ${current}/search-client.js ${search1})"
readonly output2="$(${node} ${current}/search-client.js ${search2})"

ps aux | grep '[a]pi-gateway' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 printf 'Failed killing API gateway process'
    exit 1
fi

if [[ -n "$(ps aux | grep '[s]earch-client')" ]]; then
    >&2 printf 'Client processes not terminated'
    exit 1
fi

if [[ "${output1}" != "${id1}" ]]; then
    >&2 printf "Wrong results: expected '${id1}', got '${output1}'"
    exit 1
fi

if [[ "${output2}" != "${id2}" ]]; then
    >&2 printf "Wrong results: expected '${id2}', got '${output2}'"
    exit 1
fi
