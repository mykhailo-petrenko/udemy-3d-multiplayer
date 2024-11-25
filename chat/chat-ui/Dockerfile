# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:22.11.0-alpine3.20 AS development

# Set working directory
WORKDIR /app

#
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

# Same as npm install
RUN yarn install

COPY . /app

ENV CI=true
ENV PORT=3000

CMD [ "yarn", "dev" ]

FROM development AS build

RUN yarn build


# 2. For Nginx setup
FROM nginx:alpine

# Copy config nginx
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /app/dist .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
