# **Viettel Digital Talent - Practice 3: Set up a three-tier web application that displays the course attendees’ information on the browser using docker-compose.**
## **Table of Contents**

Source code: [ducduongn/VDTStudentsApp](https://github.com/ducduongn/VDTStudentsApp.git)

[I. Overview](#overview)   

       
[II. Step-by-step](#steps)
   - [1. Set up virtual environment](#venv)            
   - [2. Install dependencies](#dependencies)    
- [References](#refs)             
----  

## I. Overview
<a name='overview'></a >      

### 1. Docker 

### 2. Docker Compose

### 3. Three-tier web application

### 4. Discriminate docker instruction

## II. Step-by-step 
<a name='steps'></a >      

### 1. Install Docker

Before going into this practice, please make sure that you have already installed and downloaded `Docker`. If you do not have Docker on your computer, please follow these tutorials belows to install and download `Docker`. Make sure that you follow the right one depends on your operating system:

   - [Install Docker Desktop on Mac](https://docs.docker.com/desktop/mac/install/) 
   - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/windows/install/)
   - [Install Docker Desktop on Linux](https://docs.docker.com/desktop/linux/install/)

### 2. Install Docker Compose

In order to install `Docker Compose`, please follow [this instruction](https://docs.docker.com/compose/install/). Note that on desktop systems like Docker Desktop for Mac and Windows, `Docker Compose` is included as part of those desktop installs so you don't have to install `Docker Compose` seperately. 

### 3. Set up development environment

- As we are going to develop and dockerizing an three-tier web application, using `Docker Compose` is really helpful as it allows you to configure your application’s services. The infrastructure can be defined in a single file and built with a single command. In this step, we're going to set up the `docker-compose.yml` file.

- The `docker-compose.yml` file below defines the application infrastructure as individual services:

```yml
version: '3.7'
services:
  web-server:
    container_name: web-server-dev
    build:
        context: ./frontend
        dockerfile: Dockerfile
    tty: true 
    ports:
        - "3000:3000"
    volumes:
        - ./frontend:/app 
        - /app/node_modules
    networks:
        - frontend

  mongodb:
    image: mongo:5.0
    container_name: mongodb-dev
    restart: unless-stopped
    command: mongod --auth
    environment:
        MONGO_INITDB_ROOT_USERNAME: "ducduongn"
        MONGO_INITDB_ROOT_PASSWORD: "password"
        MONGO_INITDB_DATABASE: student-db
        MONGODB_DATA_DIR: /data/db
    volumes:
        - mongodbdata:/data/db
        - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    networks:
        - backend

  api:
        container_name: app-api-dev
        build: 
            context: ./backend
            dockerfile: Dockerfile
        environment:
            MONGODB_HOST: mongodb
            MONGODB_USERNAME: "apiuser"
            MONGODB_PASSWORD: "apipassword"
            MONGODB_DBNAME : "student-db"
            MONGODB_AUTH_SOURCE : "student-db"
            
        volumes:
            - appdata:/var/www/
        depends_on: 
            - mongodb
        networks:
            - frontend
            - backend                    

networks:
   frontend:
      driver: bridge
   backend:
      driver: bridge
volumes:
   mongodbdata:
      driver: local
   appdata:
      driver: local      
```

- As you can see, there are 3 services are defined in the `docker-compose.yml` file which are: 
   - web-server (Presentation tier)
   - api (Application tier)
   - mongodb (Data tier)

- Each service will listen to other service through a network. There are 2 networks which are defined in this file: 

```yml
...
networks:
   frontend:
      driver: bridge
   backend:
      driver: bridge
...
```
- As you can see, the `webserver` service is connected to `api` service through the `frontend` network, while the `api` service is connected to `mongodb` service through `backend` network.

![image](img/docker-network.png)

- Now we're going into details of each services in this architecture :p.

#### a) mongodb service
```yml
...
mongodb:
    image: mongo:5.0
    container_name: mongodb-dev
    restart: unless-stopped
    command: mongod --auth
    environment:
        MONGO_INITDB_ROOT_USERNAME: "ducduongn"
        MONGO_INITDB_ROOT_PASSWORD: "password"
        MONGO_INITDB_DATABASE: student-db
        MONGODB_DATA_DIR: /data/db
    volumes:
        - mongodbdata:/data/db
        - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    networks:
        - backend
...        
```
- `image` defines the base image `mongo:5.0`. 
- `container_name` define the name of the container after being built
- `restart` define the policy which restarts a container irrespective of the exit code but will stop restarting when the service is stopped or removed.

- `command` define the command that will be executed when the container is started. In this service, command `mongod --auth` will enable security in `MongoDB`.

- `environment` defines the environment variables:
   - `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` create a root user with the given credentials
   - `MONGO_INITDB_DATABASE` create an database (collection in `MongoDB`) when the container is started. 

   - `MONGODB_DATA_DIR` defined the directory where data will be stored. MongoDB stores its data in /data/db by default, therefore the data in the /data/db folder will be written to the named volume mongodbdata for persistence. 

- `networks` tells docker to create a user-defined bridge network called `backend`. Containers connected to this network will be able to access this container.

- `volumes` property copy the `mongo-init.js` file to `docker-entrypoint-initdb.d`directory in the container. Then it will be executed once the database student-db is created. The `mongo-init.js` has the following content:

```javascript
db.createUser(
    {
        user: 'apiuser',
        pwd: 'apipassword',
        roles: [
            {
                role: 'readWrite',
                db: 'student-db'
            }]
    })

db.createCollection('student');

db.student.insertMany([
  {
    sid: parseInt(1),
    full_name: "Võ Minh Thiên Long",
    year_of_birth: 2000,
    university: "Đại học Tổng hợp ITMO",
    major: "Kỹ thuật phần mềm"
  },
  {
    sid: 2,
    full_name: "Nguyễn Văn Hải",
    year_of_birth: 2001,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Khoa học máy tính"
  },
   ...
]);    
```
- As it is never advisable to use the root user to access the database in an application. Therefore, the first task is to create an non-root user which is `apiuser` with password: `apipassword`. This user has the readWrite role in the database. The second task is creating an collection named `student` to store the data of students. Then the final task is insert the datasourse representing the list of students. This datasource is in json type.

### b) api services
```yml
...
 api:
        container_name: app-api-dev
        build: 
            context: ./backend
            dockerfile: Dockerfile
        environment:
            MONGODB_USERNAME: "apiuser"
            MONGODB_PASSWORD: "apipassword"
            MONGODB_DBNAME : "student-db"
            MONGODB_AUTH_SOURCE : "student-db"
            
        volumes:
            - appdata:/var/www/
        depends_on: 
            - mongodb
        networks:
            - frontend
            - backend   
...        
```
- `build` property tells docker to build the api image using the Dockerfile located in the backend directory
- `environment` property contains the environment variables that are passed to the container: 
   - `MONGODB_USERNAME` and `MONGODB_PASSWORD` defines the username and password which is created in the `mongo-init.js` file. 
   - `MONGODB_DBNAME` refers to the collection which is also created in the `mongo-init.js` file.
   - `MONGODB_AUTH_SOURCE` property makes sure that this user has the authentication in the collection `student-db`.

- `volumes` property defines the volumes which the service is using. In this case the volume appdata is mounted inside the container at the /var/www directory.
- `depends_on` makes sure that the `api` service only runs if the `mongodb` service is running.
- `network` property specifies `frontend` and `backend` as the networks the `api` service will have access to.

#### Dockerfile
- Next, we are going to build a Dockerfile for this `api` service. 

```Dockerfile
FROM python:3.9

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

#Define the working directory
WORKDIR /app

#Add Flask app to working directory
ADD . /app

# Start the Gunicorn server listening on port 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### c) web-server service

- On the development environment, I am not using Nginx on the `web-server` but on the production environment to see the difference. 

```yml
...
web-server:
    container_name: web-server-dev
    build:
        context: ./frontend
        dockerfile: Dockerfile
    tty: true 
    ports:
        - "3000:3000"
    volumes:
        - ./frontend:/app 
        - /app/node_modules
    networks:
        - frontend    
...        
```
- The `build` property tells docker to build the api image using the Dockerfile located in the backend directory
- `ports` property defined the exposed ports of this service. The format n:m simply maps the containers port m to the host’s port n, thereby exposing the application to the host. Our node app is running on port 3000 inside the container
- `tty` tells Docker to allocate a virtual terminal session within the container. This is commonly used with the -i (or --interactive) option, which keeps STDIN open even if running in detached mode (more about that later)
- `volumes` in `web-server` service define 2 volumes. The 1st one is to mount the `frontend` directory into the `/app` in the container. The 2nd one is to define a directory to save the dependencies of the ReactJs application. 

#### Dockerfile
- Next, we are going to build a Dockerfile for this `web-server` service. 
```Dockerfile
# Pull latest official node image
FROM node:latest

# Expose ports
EXPOSE 3000
EXPOSE 35729

# Set working directory
WORKDIR /app

# Add /app/node_modules/.bin to environment variables
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files and install app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
RUN npm install react-scripts -g

# Add React app to working directory
ADD . /app

# Start the ReactJs app
CMD ["npm", "start"]
```

## Deploy
Great! Now we have already defined all the services in the docker-compose.yml file. Let's head into deployment. 

- To deploy using docker-compose, run in background mode (with -d option):
```
docker-compose up -d
```

- Result: 

![image](img/container-dev.png)   

- Now let's test the application!

### Test ReactJS Application
- We can see that the ReactJS application is running on the port 3000:

![image](img/app-dev.png)

### Test Flask API
- We can see that the Flask API is running on the port 5000:

![image](img/app-api-dev.png)

### Review
- Next we are going to look into the sized of images created from the containers: 

![image](img/images-dev.png)

- As we can see, the `mongo` image is the base image so we can't not optimize its size. 
- The `vdtstudentsapp_api` is created from the base image `python` with 42MB size bigger. This increasing size is from the package from Python Flask.
- The images `vdtstudentsapp_web-server` has the highest size as the ReactJs needs to install a lot of heavy dependencies. So our task is to minimize the size of this image. Now we are going to use Nginx to solve this problem ;) .

### 4. Set up production environment

- Firstly, we are going to create a new docker-compose file for production. This file's name is `docker-compose-prod.yml`: 

```yml
version: '3.7'
services:
  web-server:
    container_name: web-server-prod
    build:
        context: ./frontend
        dockerfile: Dockerfile-prod
    tty: true 
    ports:
        - "80:80"
    volumes:
        - ./frontend:/app 
        - /app/node_modules
    networks:
        - frontend

  mongodb:
    image: mongo:5.0
    container_name: mongodb
    restart: unless-stopped
    command: mongod --auth
    ports:
        - "27017:27017"
    environment:
        MONGO_INITDB_ROOT_USERNAME: "ducduongn"
        MONGO_INITDB_ROOT_PASSWORD: "password"
        MONGO_INITDB_DATABASE: student-db
        MONGODB_DATA_DIR: /data/db
    volumes:
        - mongodbdata:/data/db
        - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    networks:
        - backend

  api:
        container_name: app-api
        build: 
            context: ./backend
            dockerfile: Dockerfile
        ports:
            - "5000:5000"
        environment:
            MONGODB_HOST: mongodb
            MONGODB_USERNAME: "apiuser"
            MONGODB_PASSWORD: "apipassword"
            MONGODB_DBNAME : "student-db"
            MONGODB_AUTH_SOURCE : "student-db"
            
        volumes:
            - appdata:/var/www/
        depends_on: 
            - mongodb
        networks:
            - frontend
            - backend                    

networks:
   frontend:
      driver: bridge
   backend:
      driver: bridge
volumes:
   mongodbdata:
      driver: local
   appdata:
      driver: local      
```

- As you can see, there is not much difference between the new and the old docker-compose file, except for the `web-server` service: 
```yml
...
web-server:
    container_name: web-server-prod
    build:
        context: ./frontend
        dockerfile: Dockerfile-prod
    tty: true 
    ports:
        - "80:80"
    volumes:
        - ./frontend:/app 
        - /app/node_modules
    networks:
        - frontend
...
```
- Now the `dockerfile` properties is changed to the new `Dockerfile-prod `file. Also the port of this service is changed to 80. 

- Now let's look into the `Dockerfile-prod `file:

```Dockerfile
# Create image based on node image
FROM node:latest as build

# Set working directory
WORKDIR /app
ADD . /app

# Add /app/node_modules/.bin to environment variables
ENV PATH /app/node_modules/.bin:$PATH

# Install all app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts -g

# Build the app
RUN npm run build

# Create image based on nginx and deploy React app
FROM nginx:1.22.0-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Remove the default.conf to reduce the size of the resulting image
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx.conf web server configuration inside of the container
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

# Start the Nginx server.
CMD ["nginx", "-g", "daemon off;"]
```

- Next, we need to configure Nginx as a reverse proxy to forward requests to Gunicorn on :5000. A reverse proxy server is used to direct client requests to the appropriate back-end server. It provides an additional layer of abstraction and control to ensure the smooth flow of network traffic between clients and servers.

- In this practice, we are going to build our React app for production and deploy it using Nginx and Gunicorn in order to run both the React app and api on the same port.

- To run the application on Nginx server we need to create an Nginx config file nginx.conf in the /frontend folder

```
upstream app_api {
    server api:5000;
}

server {
    listen 80;
    server_name localhost;
    
    location /api {
        proxy_pass http://app_api;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }
    
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.html;
        try_files $uri $uri/ /index.html;
    }
    
}
```

- In the 1st `location` line, we define that all calls to /api will be rerouted by reverse proxy to port 5000  which is our FlaskAPI.

- In the 2nd `location` line, Nginx will direct all calls to the `/` route to index.html in /usr/share/nginx/html, where our React app resides.

## Deploy
Now let's move to the final part is depoying! 

- To deploy using the `docker-compose-prod` file, run:

```
docker-compose -f docker-compose-prod.yml up --build -d
```

- Now the React app can be accessed at http://localhost:80 and the Flask API on the same port at http://localhost:80/api/students.

![image](img/app-prod.png)   

![image](img/app-api-prod.png)  

- Finally, let's have a look at the size of the images in the production environment:

![image](img/images-prod.png)   

- As you can see, the size of the `vdtstudentsapp_web-server` now reduced to only 24.73MB, which is much much smaller than the size 1.76GB on the development environment. The reason for this is that Nginx only host with the html, js and css files without install any other dependencies. Therefore, the total size of the image after being built is much smaller and good for optimization.

## References
<a name='refs'></a >      

[1] https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker
 
[2] https://www.ibm.com/cloud/learn/three-tier-architecture