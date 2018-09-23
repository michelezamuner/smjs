FROM node:6

WORKDIR /app

COPY . /app

RUN yarn

CMD ["yarn", "test"]
