# production environment
FROM nginx:1.18.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html =404; } }' > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]