FROM node:16

EXPOSE 9999

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

run npm install

COPY . .

CMD [ "node", "./src/index.js" ]