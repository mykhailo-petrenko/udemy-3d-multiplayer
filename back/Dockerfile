FROM node:22.11.0-alpine3.20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY ./history.js ./
COPY ./main.js ./

ENTRYPOINT ["npm","start"]
