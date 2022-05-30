FROM mongo:5.0

ENV MONGO_INITDB_ROOT_USERNAME="admin"
ENV MONGO_INITDB_ROOT_PASSWORD="Phananh272"
ENV MONGO_INITDB_DATABASE="class"

COPY ./db-init-1.js /docker-entrypoint-initdb.d/
COPY ./db-init-2.js /docker-entrypoint-initdb.d/