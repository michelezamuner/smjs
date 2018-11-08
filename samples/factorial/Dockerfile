FROM node:10

WORKDIR /app

COPY ./tmp/src/ /app/src/
COPY ./tmp/package.json /app/package.json
COPY ./tmp/yarn.lock /app/yarn.lock
COPY ./tmp/bin/ /app/bin/
COPY ./tmp/*.js /app/
COPY ./factorial.basm /app/factorial.basm

RUN yarn
