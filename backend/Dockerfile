FROM node:15

WORKDIR /app
ADD package*.json /app/

RUN npm install --mode=production

ADD . .

EXPOSE 80

CMD ["npm", "start"]