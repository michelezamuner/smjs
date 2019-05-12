#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"

readonly endpoint="$1"
readonly input="$2"
readonly response="$3"

${node} "${current}/response-endpoint-service-app.js" "${endpoint}" "${response}" >/dev/null 2>&1 & disown
sleep 1

readonly output1="$(${node} ${current}/response-endpoint-service-client.js ${input})"
readonly output2="$(${node} ${current}/response-endpoint-service-client.js ${input})"

ps aux | grep '[r]esponse-endpoint-service-app' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 printf 'Failed killing service process'
    exit 1
fi

if [[ -n "$(ps aux | grep '[r]esponse-endpoint-service-client')" ]]; then
    >&2 printf 'Client processes not terminated'
    exit 1
fi

if [[ "${output1}" != "${response}" ]]; then
    >&2 printf "Wrong results: expected '${response}', got '${output1}'"
    exit 1
fi

if [[ "${output2}" != "${response}" ]]; then
    >&2 printf "Wrong results: expected '${response}', got '${output2}'"
    exit 1
fi



