#build environment
FROM node:14 as build
WORKDIR /frontend
ENV PATH /code/node_modules/.bin:$PATH
COPY . /frontend/
RUN npm install --silent
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
