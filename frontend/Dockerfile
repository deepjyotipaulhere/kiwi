FROM node:alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY . /usr/src
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]