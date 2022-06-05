# Practice 3: Set up a three-tier web application using docker-compose.


Author: **Vo Minh Thien Long**

----        
## Table of contents
[I. Requirement](#requirement)

[II. Prerequisites knowledge](#knowledge)
- [1. Docker](#docker)
- [2. Flask](#flask)
- [3. React](#react)
- [4. MongoDB](#mongodb)
- [5. Nginx](#nginx)

[II. Install Docker](#install)
- [1. Prerequisites system](#prerequisites-system)
- [2. Install Docker on Ubuntu](#install-ubuntu)
- [3. Executing the Docker command without `sudo`](#install-without-sudo)

[III. First set up](#setup)
- [1. Install Ansible](#install-ansible)
- [2. Configure Ansible](#configure-ansible)
- [3. Create `host` inventory](#host-inventory)
- [4. Create playbook](#create-playbook)
- [5. Deploy](#deploy)

[IV. Applied Ansible Roles](#roles)
- [1. Overview](#roles-overview)
- [2. Ansible Galaxy](#ansible-galaxy)
- [3. Role `common`](#role-common)
- [4. Role `prometheus`](#role-prometheus)
- [5. Role `grafana`](#role-grafana)
- [6. Role `node-exporter`](#role-node-exporter)
- [7. Deploy](#roles-deploy)

[V. Applied `jinja2` template](#encountered-errors)
- [1. Overview](#jinja2-overview)
- [2. Role `common`](#jinja2-common)
- [3. Role `prometheus`](#jinja2-prometheus)
- [4. Role `grafana`](#jinja2-grafana)
- [5. Role `node-exporter`](#jinja2-node-exporter)
- [6. Deploy](#jinja2-deploy)

[VI. References](#references)

---- 

## I. Requirements

Set up a **three-tier** web application that displays the course attendees’ information on the 
browser using `docker-compose`.

Base images:

- For Nginx web server: `nginx:1.22.0-alpine`

- For Python: `python:3.9`

- For MongoDB database: `mongo:5.0`


<div align="center">
  <img width="1500" src="assets/requirement.png" alt="Homework">
</div>

<div align="center">
  <i>Homework for practice 3.</i>
</div>


## II. Prerequisites knowledge
<a name='knowledge'></a>

### 1. Docker
<a name='docker'></a>

#### 1.1. Overview

**Docker** is a set of **platform as a service** (_PaaS_) products that use OS-level 
virtualization to deliver software in packages called **containers**. The service 
has both _free_ and _premium_ tiers. The software that hosts the containers is called 
**Docker Engine**. It was first started in 2013 and is developed by **Docker, Inc**.

**Docker** makes development efficient and predictable. **Docker** takes away repetitive, 
mundane configuration tasks and is used throughout the development lifecycle for fast, 
easy and portable application development – desktop and cloud. **Docker**’s comprehensive 
end to end platform includes _UIs_, _CLIs_, _APIs_ and _security_ that are engineered to work 
together across the entire application delivery lifecycle.


<div align="center">
  <img width="500" src="assets/docker-logo.png" alt="Docker logo">
</div>

<div align="center">
  <i>Docker logo.</i>
</div>

**Docker** can package an application and its dependencies in a virtual container that can run 
on any _Linux_, _Windows_, or _macOS_ computer. When running on Linux, **Docker** uses the 
resource isolation features of the **Linux kernel** and a union-capable file system to allow c
ontainers to run within a single _Linux_ instance, avoiding the overhead of starting and 
maintaining virtual machines. 

**Note:** Docker on macOS uses a Linux virtual machine to run the containers.

<div align="center">
  <img width="500" src="assets/docker-linux-interfaces.png" alt="Docker with Linux kernel">
</div>

<div align="center">
  <i>Docker can use different interfaces to access virtualization features of the Linux kernel.</i>
</div>

#### 1.2. Docker architecture (components)

The Docker software as a service offering consists of three components:

- **Software**: 

  - The **Docker daemon**, called `dockerd`, is a persistent process that manages Docker containers 
and handles container objects. The daemon listens for requests sent via the Docker Engine API.
  
  - The **Docker client program**, called `docker`, provides a **command-line interface** (_CLI_), 
that allows users to interact with Docker daemons.


- **Objects**: Docker objects are various entities used to assemble an application in Docker. 
The main classes of Docker objects are **images**, **containers**, and **services**.

  - **Container** is a standardized, encapsulated environment that runs applications. 
A container is managed using the Docker API or CLI.
  
  - **Image** is a _read-only_ template used to build containers. 
Images are used to _store_ and _ship_ applications.
  
  - **Service** allows containers to be scaled across multiple Docker daemons. 
The result is known as a _swarm_, a set of cooperating daemons that communicate through the Docker API.


- **Registries**: A **Docker registry** is a repository for Docker images.


<div align="center">
  <img width="1500" src="assets/docker-architecture.png" alt="Docker architecture">
</div>

<div align="center">
  <i>Docker architecture.</i>
</div>

#### 1.3. Containers and Images

> Today, all major cloud providers and leading open source serverless frameworks use our platform, and many are leveraging Docker for their container-native IaaS offerings.

**Containers** are **isolated** from one another and bundle their own software, libraries and
configuration files; they can communicate with each other through well-defined channels.
Because all of the containers share the services of _a single operating system kernel_,
they use **fewer resources** than virtual machines.

Because Docker containers are **lightweight**, a single server or virtual machine can run 
several containers _simultaneously_.

<div align="center">
  <img width="1500" src="assets/docker-container-vs-vm.png" alt="Containers vs Virtual machines">
</div>

<div align="center">
  <i>Containers vs Virtual machines.</i>
</div>


A **Docker image** is a file used to _execute code_ in a **Docker container**. **Docker images** act as a 
set of instructions to build a Docker container, like a template. **Docker images** also act 
as the starting point when using Docker. An image is comparable to a _snapshot_ in virtual 
machine environments.

#### 1.4. Docker registry

The **Registry** is a _stateless_, _highly scalable_ server side application that **stores** and 
lets you **distribute** Docker images. Docker clients connect to  registries to download 
(_pull_) images for use or upload (_push_) images that they have built. Registries can be 
_public_ or _private_. 

**Docker Hub** is the default registry where Docker looks for images. 
Docker registries also allow the creation of notifications based on events.


<div align="center">
  <img width="1500" src="assets/docker-hub.png" alt="Docker Hub logo">
</div>

<div align="center">
  <i>Docker Hub logo.</i>
</div>

#### 1.5. Dockerfile

Docker can build images automatically by reading the instructions from a `Dockerfile`. 
A `Dockerfile` is a text document that contains all the commands a user could call on the 
command line to assemble an image. Using `docker build` users can create an automated build 
that executes several command-line instructions in succession.

**Instructions**:

- `FROM` instruction:

  ```dockerfile
  FROM [--platform=<platform>] <image> [AS <name>]
  ```
  
  The `FROM` instruction initializes a new build stage and sets the **Base Image** for subsequent instructions.
  A _valid **Dockerfile**_ must start with a `FROM` instruction.


- `ARG` (argument) instruction:
  ```dockerfile
  ARG <name>[=<default value>]
  ```
  
  The `ARG` instruction defines a **variable** that users can pass at **build-time** to the builder with the docker build command using the 
`--build-arg <varname>=<value>` flag.


- `ENV` (environment) instruction:

  ```dockerfile
  ENV <key>=<value> ...
  ```

  The `ENV` instruction sets the **environment variable** `key` to the value `value`. This
value will be in the environment for all subsequent instructions in the build stage and can
be _replaced inline_ in many as well.


- `WORKDIR` (working directory) instruction:
  ```dockerfile
  WORKDIR /path/to/workdir
  ```
  
  The `WORKDIR` instruction sets the **working directory** for any `RUN`, `CMD`, `ENTRYPOINT`, 
`COPY` and `ADD` instructions that follow it in the **Dockerfile**. If the `WORKDIR` doesn’t exist, 
it will be created even if it’s not used in any subsequent Dockerfile instruction.

  The `WORKDIR` instruction can be used _multiple times_ in a Dockerfile. If a relative path is 
provided, it will be **relative** to the path of the previous `WORKDIR` instruction.

  
- `USER` instruction:

  ```dockerfile
  USER <user>[:<group>]
  ```
  
  or 
  
  ```dockerfile
  USER <UID>[:<GID>]
  ```
  
  The `USER` instruction sets the **user name** (or _UID_) and optionally the **user group** (or _GID_) 
to use when running the image and for any `RUN`, `CMD` and `ENTRYPOINT` instructions that follow it 
in the `Dockerfile`.


- `RUN` instruction: There 2 forms of `RUN`: _shell_ form and _exac_ form.
  
  The _shell_ form:
  ```dockerfile
  RUN <command>
  ```
  or the _exac_ form (**preferred**):
  ```dockerfile
  RUN ["executable", "param1", "param2"]
  ```

  The `RUN` instruction will **execute any commands** in a new layer on top of the current image and commit the results. 
The resulting committed image will be used _for the next step_ in the `Dockerfile`.

  **Note**: The _exec_ form is parsed as a JSON array, which means that you must use double-quotes `"`
around words not single-quotes `'`. Unlike the _shell_ form, the _exec_ form does not invoke a command shell.


- `ENTRYPOINT` instruction: `ENTRYPOINT` has 2 forms: _shell_ form and _exac_ form  (**preferred**).

  ```dockerfile
  ENTRYPOINT command param1 param2
  ```
  and
  ```dockerfile
  ENTRYPOINT ["executable", "param1", "param2"]
  ```

  An `ENTRYPOINT` allows you to configure a container that will run as an executable. 
Command line _arguments_ to `docker run <image>` will be _appended_ after all elements in 
an exec form `ENTRYPOINT`, and will override all elements specified using `CMD`. 
This allows **arguments to be passed** to the entry point.


- `CMD` instruction: The `CMD` instruction has three forms:

  _exec_ form, this is the **preferred** form
  ```dockerfile
  CMD ["executable","param1","param2"]
  ```
  
  as _default parameters_ to `ENTRYPOINT`
  ```dockerfile
  CMD ["param1","param2"]
  ```

  _shell_ form
  ```dockerfile
  CMD command param1 param2
  ```

  There can only be one `CMD` instruction in a `Dockerfile`. 

  The main purpose of a CMD is to **provide defaults for an executing container**. These defaults 
can include an executable, or they can omit the executable, in which case you must specify an `ENTRYPOINT` instruction as well.


**Note**:

- `ARG` vs `ENV`: 
  - `ENV` is for future running containers. 
  - `ARG` for building your Docker image. 
  - We can’t change `ENV` directly during the build.


  <div align="center">
    <img width="500" src="assets/docker-arg-vs-env.png" alt="ARG vs ENV">
  </div>
  
  <div align="center">
    <i>ARG vs ENV.</i>
  </div>
  
- `COPY` vs `ADD`: `COPY` is same as `ADD`, but without the **tar** and **remote URL** handling.

  - `COPY` doesn't support `src` with URL scheme.
  - `COPY` doesn't unpack compression file.
  - `COPY` support to overwrite build context by `--from` argument.

  A valid use case for `ADD` is when you want to **extract a local tar file** into a specific directory in your Docker image.
If you’re **copying in local files** to your Docker image, always use `COPY` because it’s more explicit.


  <div align="center">
    <img width="500" src="assets/docker-copy-vs-add.webp" alt="ARG vs ENV">
  </div>

  <div align="center">
    <i>ARG vs ENV.</i>
  </div>

- `CMD` vs `ENTRYPOINT`: Any **Docker image** must have an `ENTRYPOINT` or `CMD` declaration for a container to start.

  - `CMD` sets default parameters that can be **overridden** from the Docker **CLI** 
when a container is running.
  
  - The best way to use a `CMD` instruction is by specifying default programs that should run when 
users do not **input arguments** in the command line.
  
  - `ENTRYPOINT` is efault parameters that **cannot be overridden** when Docker containers run with 
**CLI** parameters.
  
  - Use `ENTRYPOINT` instructions when building an executable Docker image using commands that **always need to be executed**.

  We can use `CMD` and `ENTRYPOINT` together when we  automate container startup tasks. 
In such a case, the `ENTRYPOINT` instruction can be used to define the **executable** while using `CMD` to define **parameters**.

#### 1.6. Docker compose

**Compose** is a tool for **defining** and **running** _multi-container_ Docker applications. 
With Compose, you use a `YAML` file to configure your application’s services. Then, with 
a single command, you _create_ and _start all_ the services from your configuration.

- Defines and runs **multi-container** applications.
- Manages all containers using a single `docker-compose.yml` file.
- Manages volumes & networks automatically.
- Preserve volume data when containers are created.
- Only recreate containers that have changed
- Variables and moving a composition between environments.

Three-step process of using **Compose**:

1. Define your app’s **environment** with a `Dockerfile` so it can be reproduced anywhere.

2. Define the **services** that make up your app in `docker-compose.yml` so they can be run
together in _an isolated environment_.

3. Run `docker compose up` (or `docker-compose up`) and the **Docker compose command** starts and runs your entire app.

A `docker-compose.yml` looks like this:

```yaml
version: "3.9"  # optional since v1.27.0
services:
  web:
    build: .
    ports:
      - "8000:5000"
    volumes:
      - .:/code
      - logvolume01:/var/log
    links:
      - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```

### 2. Flask
<a name='flask'></a>

**Flask** is a _micro web framework_ written in **Python**. It **does not require** particular 
_tools_ or _libraries_, and **has no** database abstraction layer, form validation, 
or any other components where pre-existing third-party libraries provide common functions. 

However, **Flask** supports extensions that can add application features. Extensions exist for 
object-relational mappers, form validation, upload handling, 
various open authentication technologies and several common framework related tools.

In this practice, I use **Flask** as a _Backend server_ for **Logic Tier**.

<div align="center">
  <img width="500" src="assets/flask-logo.png" alt="Flask logo">
</div>

<div align="center">
  <i>Flask logo.</i>
</div>

### 3. ReactJs
<a name='react-js'></a>

**React** is a _free_ and _open-source_ **front-end JavaScript library** for building user interfaces 
based on UI components. It is maintained by Meta and a community of individual developers and 
companies. 

**React** can be used as a base in the development of _single-page_, _mobile_, 
or _server-rendered_ applications with frameworks. However, **React** is only 
concerned with state management and rendering that state to the `DOM`, so creating **React** 
applications usually requires the use of additional libraries for routing, as well as certain
_client-side_ functionality.

In this practice, I use **React** as a _Frontend UI_ for **Presentation Tier**.

<div align="center">
  <img width="500" src="assets/react-logo.png" alt="React logo">
</div>

<div align="center">
  <i>React logo.</i>
</div>

### 4. MongoDB
<a name='mongodb'></a>

MongoDB is a _source-available_, _cross-platform_ **document-oriented database** program. 
Classified as a **NoSQL** database program, MongoDB uses **JSON-like** documents with optional 
schemas. 

MongoDB is developed by MongoDB Inc. and licensed under the 
**Server Side Public License** (_SSPL_).

In this practice, I use **React** as a _Datbase_ for **Data Tier**.

<div align="center">
  <img width="500" src="assets/mongodb-logo.png" alt="MongoDB logo">
</div>

<div align="center">
  <i>MongoDB logo.</i>
</div>

### 4. Nginx
<a name='nginx'></a>

Nginx (pronounced **engine X**) is a web server that can also be used as a **reverse proxy**, 
**load balancer**, **mail proxy** and **HTTP cache**. The software was created by **Igor Sysoev** and publicly released in **2004**. 

**Nginx** is _free_ and _open-source_ software, released under the terms of the _2-clause BSD license_. 
A large fraction of web servers use **Nginx**, often as a load balancer. 

In this practice, I use **Nginx** to serve web content (by **React**).


<div align="center">
  <img width="500" src="assets/nginx-logo.png" alt="Nginx logo">
</div>

<div align="center">
  <i>Nginx logo.</i>
</div>

## III. Install Docker
<a name='install'></a>

### 1. Prerequisites system
<a name='prerequisites-system'></a>

### 2. Install Docker on Ubuntu
<a name='install-macos'></a>

We will install Docker from the official **Docker repository**, to ensure that we get the 
latest version. The reason is that Docker in **Ubuntu repository** may not be the latest.

First, update your existing list of packages by using `apt update`:

```shell
sudo apt update
```

Then we will install prerequisite packages which let `apt` use packages over **HTTPS**:

```shell
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

The **Docker GPG key** is added to verify the download, the official **Docker repository** 
is added as a new package source.

```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Add the **Docker repository** to **APT sources**. Because I use **Ubuntu** `20.04` - **Ubuntu Focal** in
a machine using M1 chip (**ARM64** architecture), so I set `arch=arm64` and choose the 
stable version `focal focal`.

```shell
sudo add-apt-repository "deb [arch=arm64] https://download.docker.com/linux/ubuntu focal stable"
```

This will also update our package database with the Docker packages from the newly added repository. 

Make sure you are about to install from the Docker repository instead of the default Ubuntu repository:

```shell
apt-cache policy docker-ce
```

You’ll see output like this (Notice that `docker-ce` is **not installed**).

<div align="center">
  <img width="1500" src="assets/docker-install-check.png" alt="Check install from the Docker repository instead of the default Ubuntu repository">
</div>

<div align="center">
  <i>Homework for practice 3.</i>
</div>

Finally, install Docker:

```shell
sudo apt install docker-ce
```

Docker should now be installed, the daemon started, and the process enabled to start on boot. 
Check that it’s running:

```shell
sudo systemctl status docker
```

The output should be similar to the following:


<div align="center">
  <img width="1500" src="assets/docker-status-check.png" alt="Check Docker service">
</div>

<div align="center">
  <i>Check Docker service is active or not.</i>
</div>

### 3. Executing the Docker command without `sudo`
<a name='install-without-sudo'></a>

By default, the `docker` command can only be run the root user or by a **user** in the **docker** group,
which is automatically created during Docker’s installation process. If you want to avoid typing `sudo` 
whenever you run the `docker` command, following these steps:

First, add your username to the `docker` group:

```shell
sudo usermod -aG docker ${USER}
```

To apply the new group membership, use `su` and enter your password:

```shell
su - ${USER}
```

Confirm that we are now added to the `docker` group by typing:

```shell
groups
```

<div align="center">
  <img width="1500" src="assets/docker-group-check.png" alt="Check is user in docker group">
</div>

<div align="center">
  <i>Check is user already added to docker group.</i>
</div>

Finally, try to run `docker` by running image `hello-world`:

```shell
docker run hello-world
```

<div align="center">
  <img width="1500" src="assets/docker-run-hello-world.png" alt="docker run hello-world">
</div>

<div align="center">
  <i>Our docker is running image hello-world.</i>
</div>

## VI. References

[1] [Docker in Wikipedia](https://en.wikipedia.org/wiki/Docker_(software))

[2] [Docker website](https://www.docker.com/)

[2] [Docker documentations](https://docs.docker.com/)

[3] [Docker ARG vs ENV](https://vsupalov.com/docker-arg-vs-env/)

[3] [Docker CMD vs ENTRYPOINT](https://www.bmc.com/blogs/docker-cmd-vs-entrypoint/#:~:text=CMD%20vs%20ENTRYPOINT%3A%20Fundamental%20differences&text=CMD%20commands%20are%20ignored%20by,as%20arguments%20of%20the%20command.)
