#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly search="$1"
readonly expected="$2"
readonly node="$(which node)"

$SM_ROOT/bin/application-services/api-gateway >/dev/null &
sleep 1

readonly results="$($SM_ROOT/bin/adapters-services/search $search)"

ps aux | grep '[a]pi-gateway' | awk '{ print $2 }' | xargs kill -9 >/dev/null 2>&1
if [[ $? != 0 ]]; then
    >&2 echo Failed killing service process
    exit 1
fi

if [ "$results" != "$expected" ]; then
    >&2 echo "Wrong results: expected $expected, got $results"
    exit 1
fi
