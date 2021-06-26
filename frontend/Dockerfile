FROM node:15 AS build

WORKDIR /app
ADD package*.json .

RUN npm install --mode=production

ADD . .

FROM nginx

EXPOSE 80

COPY --from=build /app /usr/share/nginx/html