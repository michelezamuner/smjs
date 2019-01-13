FROM node:10

WORKDIR /app

COPY . /app

RUN make build

CMD make ci
