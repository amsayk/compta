FROM node:6
EXPOSE 3000
ADD . /app
WORKDIR /app

RUN cd /app;
CMD ["npm", "start"]
