#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"
readonly stubs="${current}/stubs"

readonly endpoint="$1"
readonly firstInput="$2"
readonly secondInput="$3"
readonly response11="$4"
readonly response12="$5"
readonly response21="$6"
readonly response22="$7"

readonly firstOutputFile='/tmp/sm-first-output'
readonly secondOutputFile='/tmp/sm-second-output'

SM_ENDPOINT="${endpoint}" \
    SM_RESPONSE11="${response11}" \
    SM_RESPONSE12="${response12}" \
    SM_RESPONSE21="${response21}" \
    SM_RESPONSE22="${response22}" \
    ${node} -e "C=require('container').Container;(new C()).make(require('${stubs}/App')).run();" \
    & disown
sleep 1

readonly firstOutput="$(SM_INPUT="${firstInput}" ${node} -e "C=require('${stubs}/Client');(new C).connect();" & disown)"
readonly secondOutput="$(SM_INPUT="${secondInput}" ${node} -e "C=require('${stubs}/Client');(new C).connect();" & disown)"
readonly firstTrimmed="${firstOutput//[$'\t\r\n']}"
readonly secondTrimmed="${secondOutput//[$'\t\r\n']}"

sleep 1

ps aux | grep '[n]ode -e.*/stream-endpoint-service/.*/App' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 printf 'Failed killing service process'
    exit 1
fi

if [[ -n "$(ps aux | grep '[n]ode -e.*/stream-endpoint-service/.*/Client')" ]]; then
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
