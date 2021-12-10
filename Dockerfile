FROM node:16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

WORKDIR /octopus

RUN npm i -g npm-run-all

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . ./

CMD [ "npm", "run", "start:concurrent:dev" ]