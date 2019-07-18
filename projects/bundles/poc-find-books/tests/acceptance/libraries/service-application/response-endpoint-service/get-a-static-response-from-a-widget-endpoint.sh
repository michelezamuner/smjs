#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"
readonly stubs="${current}/stubs"

readonly endpoint="$1"
readonly input="$2"
readonly response="$3"

SM_ENDPOINT="${endpoint}" \
    SM_RESPONSE="${response}" \
    ${node} -e "C=require('container').Container;(new C()).make(require('${stubs}/ui/widgeted/App')).run();" \
    & disown
sleep 1

readonly output1="$(SM_INPUT=${input} ${node} -e "C=require('${stubs}/Client');(new C).connect();")"
readonly output2="$(SM_INPUT=${input} ${node} -e "C=require('${stubs}/Client');(new C).connect();")"

ps aux | grep '[n]ode .*/response-endpoint-service/.*/App' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 printf 'Failed killing service process'
    exit 1
fi

if [[ -n "$(ps aux | grep '[n]ode .*/response-endpoint-service/.*/Client')" ]]; then
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
