# stage1 - build react app

FROM node:14-alpine AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /fe
# Cache and install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --production
# Copy app files
COPY . .
# Build the app
RUN npm run-script build

# statge2: build the final image and copy the react build files
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
#copy built assets from builder
COPY --from=builder /fe/build /usr/share/nginx/html
# Add nginx.conf
COPY nginx.conf /etc/nginx/sites-enabled/default
#expose port
EXPOSE 80
#start nginx
CMD ["nginx", "-g", "daemon off;"]