FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/server.js"]
