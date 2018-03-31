FROM node:9.10

WORKDIR /usr/app

COPY package.json .

RUN npm install -g typescript typeorm gulp-cli
RUN npm install --verbose

COPY . .
