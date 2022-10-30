FROM node:16-alpine

WORKDIR /usr/src/app

RUN npm install -g typescript

COPY package.json .

COPY yarn.lock .

RUN yarn install

COPY . .

CMD [ "yarn", "dev" ]