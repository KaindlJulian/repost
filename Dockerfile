FROM node:14.16.0-buster

WORKDIR /app
COPY . /app

RUN npm install &&\
    npm run build

EXPOSE 3000
EXPOSE $PORT

CMD ["npm", "start"]