FROM node:latest
WORKDIR /code
COPY . /code
RUN npm install