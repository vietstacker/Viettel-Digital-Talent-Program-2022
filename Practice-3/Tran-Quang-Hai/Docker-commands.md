# **COMMANDS COMPARISON**

## **1. ENV vs ARG**

## 1.1. ENV
- Environment variables (ENV) are usable both during and after the image is build.
- Example of environment variables in docker compose file:
```
version: "3.0"
services:
  db:
    image: mysql
    restart: always
    environment:
      - TZ=Asia/Ho_Chi_Minh
      - MYSQL_ROOT_PASSWORD=sohardtoguess
      - MYSQL_DATABASE=sohardtoguess
    ports:
      - 3306:3306
```
- "environment" fields are environment variables, which persist after building process
## 1.2. ARG
- Arguments are used only during building image process.
- Example of arguments in dockerfile:
```
ARG VAR_A 5
RUN echo $VAR_A
```
- VAR_A is only usable in building process.

## **2. COPY VS ADD**

## 2.1. COPY

- Used to copy files from local source to a docker container.
- Copy just duplicates the content of the file into the container.

## 2.2. ADD

- ADD command is used to copy files/directories into a Docker image, both from local sources and from URL.
- ADD command is used to download an external file and copy it to the wanted destination.

## **3. CMD VS ENTRYPOINT**

## 3.1. CMD
- CMD command provide defaults for an executing container which can be overridden.

## 3.2. ENTRYPOINT
- CMD command provide defaults for an executing container which can only be overridden with --entrypoint parameters.