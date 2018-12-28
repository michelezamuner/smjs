FROM node:10

WORKDIR /app

COPY . /app

RUN /app/build

CMD /app/test
