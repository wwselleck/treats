FROM node:latest

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install
