FROM node:alpine

WORKDIR /server

COPY package.*json .


COPY . .

RUN npm install

EXPOSE 9000

CMD [ "npm", "start" ]