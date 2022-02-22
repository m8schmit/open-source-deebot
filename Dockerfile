FROM node:lts-alpine
RUN apk add --no-cache bash
RUN yarn global add @angular/cli
WORKDIR /opt/app
USER node
