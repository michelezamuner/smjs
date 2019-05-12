#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"

readonly endpoint="$1"
readonly firstInput="$2"
readonly secondInput="$3"
readonly response11="$4"
readonly response12="$5"
readonly response21="$6"
readonly response22="$7"

readonly firstOutputFile='/tmp/sm-first-output'
readonly secondOutputFile='/tmp/sm-second-output'

${node} "${current}/stream-endpoint-service-app.js" \
    "${endpoint}" \
    "${response11}" \
    "${response12}" \
    "${response21}" \
    "${response22}" \
    >/dev/null & disown
sleep 1

readonly firstOutput="$(${node} "${current}/stream-endpoint-service-client.js" "${firstInput}" & disown)"
readonly secondOutput="$(${node} "${current}/stream-endpoint-service-client.js" "${secondInput}" & disown)"
readonly firstTrimmed="${firstOutput//[$'\t\r\n']}"
readonly secondTrimmed="${secondOutput//[$'\t\r\n']}"

sleep 1

ps aux | grep '[s]tream-endpoint-service-app' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 printf 'Failed killing service process'
    exit 1
fi

if [[ -n "$(ps aux | grep '[s]tream-endpoint-service-client')" ]]; then
    >&2 printf 'Client processes not terminated'
    exit 1
fi

readonly firstExpected="${response11}${response12}"
readonly secondExpected="${response21}${response22}"

if [[ "${firstTrimmed}" != "${firstExpected}" ]]; then
    >&2 printf "Wrong results: expected '${firstExpected}', got '${firstTrimmed}'"
    exit 1
fi
if [[ "${secondTrimmed}" != "${secondExpected}" ]]; then
    >&2 printf "Wrong results: expected '${secondExpected}', got '${secondTrimmed}'"
    exit 1
fi
