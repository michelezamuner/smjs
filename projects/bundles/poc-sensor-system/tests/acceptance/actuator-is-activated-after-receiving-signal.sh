#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly signalValue="signal"
readonly actuatorFile="$($node -e "console.log(require('$SM_ROOT/config/config.js').file_actuator.output_file);")"

rm -f $actuatorFile

$SM_ROOT/bin/start-system >/dev/null 2>&1 &
sleep 1

$SM_ROOT/bin/send-signal $signalValue

ps aux | grep '[s]tart-system' | awk '{ print $2 }' | xargs kill -9
ps aux | grep '[m]ain.js' | awk '{ print $2 }' | xargs kill -9

if [ ! -f $actuatorFile ]; then
    >&2 echo Missing actuator file
    exit 1
fi
if [ "$(cat $actuatorFile)" != $signalValue ]; then
    >&2 echo Wrong signal activated
    exit 1
fi
