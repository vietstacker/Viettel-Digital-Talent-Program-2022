FROM node:18.2.0-alpine AS react-build
WORKDIR /usr/src/app/
COPY . .
RUN yarn
RUN yarn build

FROM nginx:1.22.0-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /usr/src/app/build /usr/share/nginx/html
EXPOSE 9333
CMD ["nginx", "-g", "daemon off;"]