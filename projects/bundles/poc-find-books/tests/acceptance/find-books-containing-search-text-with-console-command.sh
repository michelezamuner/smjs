#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly search="$1"
readonly expected="$2"
readonly node="$(which node)"

$SM_ROOT/bin/adapters/integration-bus >/dev/null &
sleep 1

readonly results="$($SM_ROOT/bin/adapters/search $search)"

ps aux | grep '[i]ntegration-bus' | awk '{ print $2 }' | xargs kill -9

if [ "$results" != "$expected" ]; then
    >&2 echo "Wrong results: expected $expected, got $results"
    exit 1
fi
