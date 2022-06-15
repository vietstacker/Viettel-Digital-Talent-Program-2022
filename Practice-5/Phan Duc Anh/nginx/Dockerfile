FROM nginx:1.22.0-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./index.html /usr/share/nginx/html/index.html

RUN mkdir /usr/share/nginx/html/js/

COPY ./js/js.js /usr/share/nginx/html/js/js.js