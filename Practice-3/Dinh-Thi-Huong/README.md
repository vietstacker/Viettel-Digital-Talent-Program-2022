# Using Docker compose to build a 3-tiers web application

## Table of contents 
  - [I. Basic Knowlegde]()
  - [II. Configuration to create 3 tiers]()
  - [III. Docker compose up ]()
  - [References]()

---

## I. Basic Knowlegde


**1. Docker**  

- Docker is an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications. By taking advantage of Docker’s methodologies for shipping, testing, and deploying code quickly, you can significantly reduce the delay between writing code and running it in production.


- Docker uses a client-server architecture. The Docker client talks to the Docker daemon, which does the heavy lifting of building, running, and distributing your Docker containers. The Docker client and daemon can run on the same system, or you can connect a Docker client to a remote Docker daemon. The Docker client and daemon communicate using a REST API, over UNIX sockets or a network interface. Another Docker client is Docker Compose, that lets you work with applications consisting of a set of containers.


- An image is a read-only template with instructions for creating a Docker container. Often, an image is based on another image, with some additional customization. For example, you may build an image which is based on the ubuntu image, but installs the Apache web server and your application, as well as the configuration details needed to make your application run.


You might create your own images or you might only use those created by others and published in a registry. To build your own image, you create a Dockerfile with a simple syntax for defining the steps needed to create the image and run it. Each instruction in a Dockerfile creates a layer in the image. When you change the Dockerfile and rebuild the image, only those layers which have changed are rebuilt. This is part of what makes images so lightweight, small, and fast, when compared to other virtualization technologies.


- A container is a runnable instance of an image. You can create, start, stop, move, or delete a container using the Docker API or CLI. You can connect a container to one or more networks, attach storage to it, or even create a new image based on its current state. 


By default, a container is relatively well isolated from other containers and its host machine. You can control how isolated a container’s network, storage, or other underlying subsystems are from other containers or from the host machine.


A container is defined by its image as well as any configuration options you provide to it when you create or start it. When a container is removed, any changes to its state that are not stored in persistent storage disappear.



**2. Docker compose**

- Docker Compose is an orchestration tool for container-based applications, comprised of, or reliant on, multiple, loosely connected services. Unlike cluster-based orchestration tools, like Kubernetes or Swarm, Docker Compose is designed to orchestrate on a single Docker host. This provides a software developer with a significant benefit; the ability to better mimic a complete application environment, when developing their service or application. Additionally, because of the light nature of containers, and the orchestration capabilities inherent in Docker Compose, it enables developers to be more productive, as they iterate through a code-build-test cycle.
- A developer defines the components or dependencies of an application, and their configuration, using YAML syntax, in a file usually called docker-compose.yml. The service components, as they’re called, can then be manipulated individually, or collectively, through Docker Compose’s rich command line interface (CLI).

**3. Question Answering Homework**


> What are the differences between these instructions?


> ARG vs ENV


- ARG: are not available after the image is built. A running container won’t have access to an ARG variable value.

- ENV: mainly meant to provide default values for your future environment variables. Running dockerized applications can access environment variables. It’s a great way to pass configuration values to your project.


> COPY vs ADD


- COPY: is a docker file command that copies files from a local source location to a destination in the Docker container. It only has only one assigned function. Its role is to duplicate files/directories in a specified location in their existing format. If we want to avoid backward compatibility, we should use the COPY command.

- ADD: ADD command is used to copy files/directories into a Docker image. It can also copy files from a URL. ADD command is used to download an external file and copy it to the wanted destination. ADD command is less usable then COPY command.


> CMD vs ENTRYPOINT


- CMD: allows you to set a default command, which will be executed only when you run container without specifying a command. If Docker container runs with a command, the default command will be ignored. If Dockerfile has more than one CMD instruction, all but last CMD instructions are ignored.

- ENTRYPOINT: allows you to configure a container that will run as an executable. It looks similar to CMD, because it also allows you to specify a command with parameters. The difference is ENTRYPOINT command and parameters are not ignored when Docker container runs with command line parameters. (There is a way to ignore ENTTRYPOINT, but it is unlikely that you will do it.)


**4. Three-tiers web application**

- A 3-tier application architecture is a modular client-server architecture that consists of a presentation tier, an application tier and a data tier. The data tier stores information, the application tier handles logic and the presentation tier is a graphical user interface (GUI) that communicates with the other two tiers. The three tiers are logical, not physical, and may or may not run on the same physical server.
- Presentation tier: This tier, which is built with HTML5, cascading style sheets (CSS) and JavaScript, is deployed to a computing device through a web browser or a web-based application. The presentation tier communicates with the other tiers through application program interface (API) calls.
- Application tier: The application tier, which may also be referred to as the logic tier, is written in a programming language such as Java and contains the business logic that supports the application's core functions.
- Data tier: The data tier consists of a database and a program for managing read and write access to a database. This tier may also be referred to as the storage tier and can be hosted on-premises or in the cloud. Popular database systems for managing read/write access include MySQL, PostgreSQL, Microsoft SQL Server and MongoDB.


- In this lab, I'll be using: 
  - nginx:1.22.0-alpine as based image to build a container to listen to user request and call APIs of Flask App.
  - python:3.9 as based image to build backend server.
  - mongo:5.0 consists of a database of attendees


- I configures front-end server listens in port 80, backend server listens in port 5000 and database server listens in port 27017.


## II. Step by step


Here is my repository structure: 

![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/practice3/Practice-3/Dinh-Thi-Huong/img/anh1.png)

**1. Front-end server using Nginx**
-  I have prepared a React project. I will build environment to run it on Nginx web server.


- Create a Dockerfile.build to build image containing production environment
```
#build environment
FROM node:14.16-alpine3.10 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```


- Run command to build `build` image:
```
docker build -f Dockerfile.build -t build .
```


- Write a Dockerfile to build container
```
# production environment
FROM nginx:1.18.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html =404; } }' > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
```


**2. Back-end server using Flask**


- List required libraries in the requirements.txt
```
flask
pymongo
```

- Create a app.py file: 
```
from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

def get_db():
    client = MongoClient(
        host='mongo',
        port=27017,
        username='root',
        password='pass',
        authSource="admin"
    )
    db=client['VDT22']
    return db

@app.route('/api/')
def get_vdt_db():
    db=""
    try:
        db=get_db()
        _attendees=db.attendees.find()
        print(list(_attendees))
        attendees=[{
            "stt": stu["No"],
            "name":stu["Name"],
            "yearOfBirth":stu["Year Of Birth"],
            "school":stu["School"],
            "major":stu["Major"]
            } for stu in _attendees]
        return jsonify({"attendees": attendees})
    except:
        pass
    finally:
        if type(db)==MongoClient:
            db.close()
    return "hello"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```


- Write a Dockerfile to build container.
```
FROM python:3.9

WORKDIR /code

COPY . .

RUN pip install -r requirements.txt

CMD python app.py
```


**3. Database server using MongoDB**

 - I convert attendees.xlsx file, which contains attendee's information to json type and lately, import it to mongodb. 
 
 
- In my case, I use Compass to create new databse named VDT22 including attendees collection then insert file attendees.json


## III. Docker Compose up

- Write docker-compose.yml file to create containers
```
version: '3.3'

services:
  backend:
    build:
      context: backend
      dockerfile: Dockerfile
    container_name: backend
    restart: unless-stopped
    environment:
      MONGO_HOSTNAME: mongo
    ports:
      - 5000:5000
    depends_on: 
      - mongo

  frontend:
    build:
      context: frontend
      dockerfile: Dockerfile
    container_name: frontend
    restart: unless-stopped
    ports:
      - 80:80

  mongo:
    image: mongo:5.0
    container_name: mongo
    restart: unless-stopped
    command: mongod --auth
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: pass
      MONGO_INIT_DATABASE: VDT22
    ports:
      - 27017:27017
```


- To create containers, run `docker-compose up --build`.
- To verify the created images and containers, run: "docker images" and "docker ps -a"

![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/practice3/Practice-3/Dinh-Thi-Huong/img/anh2.png)

- Now, we access our mongodb database via Compass

![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/practice3/Practice-3/Dinh-Thi-Huong/img/anh3.png)

- Insert attendees.json to attendees collection:

![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/practice3/Practice-3/Dinh-Thi-Huong/img/anh4.png)


**4. Access web app**


- URL: http://localhost

![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/practice3/Practice-3/Dinh-Thi-Huong/img/anh5.png)

## References
- [Docker document](https://docs.docker.com/)
- [Building & Deploying Dockerized Flask + MongoDB Application](https://www.youtube.com/watch?v=RuaKvPq0Fzo)
