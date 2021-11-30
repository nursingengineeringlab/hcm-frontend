FROM node:latest
WORKDIR /code
ENV PATH /code/node_modules/.bin:$PATH
COPY . /code/
RUN npm install
