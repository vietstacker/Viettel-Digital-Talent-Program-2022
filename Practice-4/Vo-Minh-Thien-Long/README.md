# Practice 4: Deploy stack Prometheus + Exporter + Alertmanager + Grafana


Author: **Vo Minh Thien Long**

----        
## Table of contents
[I. Requirement](#requirement)

[II. Prerequisites knowledge](#knowledge)
- [1. Prometheus](#prometheus)
- [2. Alertmanager](#alertmanager)
- [3. Grafana](#grafana)


[VI. References](#references)

---- 

## I. Requirements

1. Deploy stack Prometheus + Exporter + Alertmanager + Grafana

   * Using docker, docker-compose, ansible to deploy
   
   * Bonus: run Prometheus + Alertmanager in a high availability

2. Define alert rules to monitoring host, containers...

3. Configure **Alertmanager** to push alert to mail (or **Slack**, **Telegram**...) 

4. Create the dashboards Grafana to monitoring host, container, ....

<div align="center">
  <img width="1000" src="assets/requirements.png" alt="Homework">
</div>

<div align="center">
  <i>Homework for practice 4.</i>
</div>


## II. Prerequisites knowledge
<a name='knowledge'></a>

### 1. Monitoring
<a name='monitoring'></a>

#### 1.1. What is monitoring?

**Monitoring** is the process of _collecting_, _aggregating_, and _analyzing_ **metrics** to 
improve awareness of your components’ characteristics and behavior. The data are collected into a **monitoring system** 
for _storage_, aggregation, _visualization_, and _initiating_ automated responses when the
values meet requirements.

**Metrics** represent the raw measurements of _resource usage_ or _behavior_ that can be observed and collected 
throughout your systems. **Metrics** are useful because they _provide insight_ into the **behavior** and **health** 
of your systems, especially when analyzed in aggregate.

In general, the difference between **metrics** and **monitoring** mirrors the difference between **data** 
and **information**.

<div align="center">
  <img width="1500" src="assets/monitoring_prometheus.webp" alt="Prometheus monitoring and metrics">
</div>

<div align="center">
  <i>Monitoring by collecting metrics in Prometheus.</i>
</div>

#### 1.2. Why monitoring?

**Monitoring** system enables you to gather statistics, store, centralize and visualize **metrics** _in real time_. These metrics collection will help to:

**1. Know when things go wrong**

A monitoring system enables you to see the bigger picture of what is going on across your infrastructure at 
**any time**, **all the time**, and **in real time**. So when things go wrong, you will quickly recognize and 
resolve it.

You can also use monitoring systems for **alerting**, which will be _triggered_ and _notify_ whenever metric values change
(which may lead to the errors). 
 
**2. Be able to debug and gain insight**

Projects never go perfectly according to plan, but a monitoring helps the project stay on track and 
perform well. Monitoring _collects_ and _aggregates_ the metrics, analyse these metrics give everyone
an idea of **what** and **how** the problems occur.

This way, when problems inevitably arise, a quick and effective solution can be implemented.

**3. Prevents incidents and faults**

Monitoring is **proactive**, meaning it finds ways to enhance the quality of applications _before bugs appear_.
Monitoring do this by show you unexpected, or uncommon **metrics value**. Combine with alerting,
when some **metrics values meet requirements**, it will notify you immediately.

For example, when the storage is nearly full (i.e the storage metrics is more than 90% for instance), 
we will know that we need to expand it or change it to the bigger one before the whole
system crashes.


**4. Analyzing long-term trends**

Monitoring solutions enable you to sample or aggregate both _current_ and _historical_ data. While fresh metrics are 
essential for troubleshooting any new issues, they are also valuable when analyzed over longer periods of time. 

Doing this help you to see **changes**, **patterns**, and **trends** over time. 

#### 1.3. What to monitor?

In DevOps, we will monitor:

- Operating System (CPU, Memory, I/O, Network, Filesystem..)

- Hardware (Server, Switch, Storage device...)

- Containers (CPU, Memory, I/O, ...)

- Applications, services (Throughput, Latency...)


- ...

#### 1.3. Monitoring, Logging and Tracing

**Logging** is used to represent state transformations within an application.
It is **immutable**, **timestamped** record of discrete events in 3 forms: Plaintext, Structured and Binary.
When things go wrong, we need logs to establish what change in state caused the error.

**Tracing** is following a program’s flow and data progression. A **trace** represents a single user’s journey through 
an entire stack of an application. It is often used for **optimisation purposes**. 

→ **Monitoring** != **Logging** != **Tracing**.

### 2. Prometheus
<a name='prometheus'></a>

#### 1.1. Docker architecture (components)

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

## II. References

[1] [An Introduction to Metrics, Monitoring, and Alerting](https://www.digitalocean.com/community/tutorials/an-introduction-to-metrics-monitoring-and-alerting)
