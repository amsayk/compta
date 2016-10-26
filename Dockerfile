FROM node:latest
EXPOSE 3000
ADD . /app
WORKDIR /app

RUN cd /app;  npm install
CMD ["npm", "start"]
