#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly current="$( cd "$(dirname "$0")" ; pwd -P )"
readonly stubs="$(realpath "$(dirname "$current")")/stubs"
readonly endpoint="$1"
readonly input="$2"
readonly response="$3"

${node} "${stubs}/application-stub.js" "${endpoint}" "${response}" >/dev/null 2>&1 & disown
sleep 1

readonly output1="$(${node} ${stubs}/client-stub.js ${input})"
readonly output2="$(${node} ${stubs}/client-stub.js ${input})"

ps aux | grep '[a]pplication-stub' | awk '{ print $2 }' | xargs kill -9
if [[ $? != 0 ]]; then
    >&2 echo Failed killing service process
    exit 1
fi

if [[ "${output1}" != "${response}" ]]; then
    >&2 echo "Wrong results: expected ${response}, got ${output1}"
    exit 1
fi

if [[ "${output2}" != "${response}" ]]; then
    >&2 echo "Wrong results: expected ${response}, got ${output2}"
    exit 1
fi



