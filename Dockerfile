FROM node:16

WORKDIR /octopus

RUN npm i -g npm-run-all

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . ./

CMD [ "npm", "run", "start:concurrent:dev" ]