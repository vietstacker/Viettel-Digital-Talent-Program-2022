FROM mongo:5.0

RUN mkdir -p /app/data

WORKDIR /app/data

COPY ./students.csv /app/data

CMD ["mongod", "&&","mongoimport", "-d", "student-db", "-c", "student","--type", "csv", "--file", "students.csv", "--headerline"]