# Practice 1: Create Ubuntu virtual machine #
---
#### Step 1: Create a network

```console
$ docker network create wordpress-network
```
### Setup Docker Engine
```sh
 $ sudo apt-get update
 $ sudo apt-get install docker-ce docker-ce-cli containerd.io 
```
 #### Kiểm tra trạng thái docker engine
```sh
 $ sudo systemctl status docker
 ```
 ![117495679-28426480-afa0-11eb-8e13-087aa666b620](https://user-images.githubusercontent.com/84090649/120457955-15655900-c3c1-11eb-978d-a14e9427728b.png)

#### Step 2: Create a volume for MariaDB persistence and create a MariaDB container

```console
$ docker volume create --name mariadb_data
$ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```

#### Step 3: Create volumes for WordPress persistence and launch the container

```console
$ docker volume create --name wordpress_data
$ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```

#### Access application at http://localhost:8080

 ![117495698-2d071880-afa0-11eb-8138-531c5494617e](https://user-images.githubusercontent.com/84090649/120458003-201fee00-c3c1-11eb-82a1-8334db9843c6.png)

# Practice 2: Deploy WordPress with Docker Compose

#### Step 1: Install Docker Compose

```console
$ sudo apt install docker-compose
```

#### Step 2: Download docker-compose.yml

```console
$ sudo apt install curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
```

#### Step 3: Run docker-compose

```console
$ sudo docker-compose up -d
```

Access application at http://localhost:8080

# Practice 3: ## Lesson 3: Create 2 Virtual Machines, 1 deploy MariaDB, 1 deploy WordPress
Similar to lesson 1, After installing 2 VMs and docker on 2 VMs, we will continue as follows:
### deploy MariaDB on VM1:

#### Step 1: Create a network

```console
$ sudo docker network create wordpress-network
```

#### Step 2: Create MariaDB volumes and create MariaDB containers
#### Open port 3306 so VM2 can connect to 
```console
$ sudo docker volume create --name mariadb_data
$ sudo docker run -d --name mariadb \
  -p 3306:3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```

## On VM2:

#### Step 1: Create volumes for WordPress persistence and launch the container




`MARIADB_PORT_NUMBER`: VM1 mariadb port

```console
$ sudo docker volume create --name wordpress_data
$ sudo docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env MARIADB_HOST=192.168.1.84 \
  --env MARIADB_PORT_NUMBER=3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```


#### Run at http://localhost:8080

![186008087_842770916328740_3723287776897405379_n](https://user-images.githubusercontent.com/84090649/120458123-38900880-c3c1-11eb-8f5b-05d521957010.png)
