FROM node:15

WORKDIR /app
ADD package*.json .

RUN npm install --mode=production

ADD . .

EXPOSE 80

CMD ["npm", "start"]