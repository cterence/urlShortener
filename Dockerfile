FROM node:latest

WORKDIR /app

COPY package.json package.json
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "server.js"]
