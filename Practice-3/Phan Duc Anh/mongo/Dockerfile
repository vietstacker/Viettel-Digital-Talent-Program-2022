FROM mongo:5.0

ENV MONGO_INITDB_ROOT_USERNAME="admin"
ENV MONGO_INITDB_ROOT_PASSWORD="Phananh272"
ENV MONGO_INITDB_DATABASE="class"

COPY ./db-init.js /docker-entrypoint-initdb.d/
COPY ./datasource.csv /data/datasource.csv
COPY docker-entrypoint.sh /usr/local/bin/