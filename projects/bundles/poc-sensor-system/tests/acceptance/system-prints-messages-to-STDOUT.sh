#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly node="$(which node)"
readonly signalValue="signal"
readonly outputFile="/tmp/system.out"

$SM_ROOT/bin/start-system >$outputFile 2>&1 &
sleep 1
$SM_ROOT/bin/send-signal $signalValue
ps aux | grep '[s]tart-system' | awk '{ print $2 }' | xargs kill -9
ps aux | grep '[m]ain.js' | awk '{ print $2 }' | xargs kill -9

if [ ! -f $outputFile ]; then
    echo Missing output file
    exit 1
fi
if [ "$(cat $outputFile)" != "Actuator activated with signal: $signalValue" ]; then
    echo Wrong log message: $(cat $outputFile)
    rm -f $outputFile
    exit 1
fi

rm -f $outputFile
