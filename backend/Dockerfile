FROM node:15

WORKDIR /app
ADD package*.json /app/

RUN npm install --mode=production

ADD . /app/

EXPOSE 80

CMD ["npm", "start"]