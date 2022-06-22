# DOCKER NETWORK 

## Content 

  - [I. What are docker network modes?]()
  - [II. How does docker-compose provide networking for its services ]()
  - [III. How does docker swarm do multi-host networking]()
  - [References]()

---

## I. What are docker network modes?

In order to connect containers, we have to configure the docker network. There are four docker network modes: 

1. Bridge mode
2. Host mode
3. None mode
4. Container mode

### 1. Bridge mode

Below is an example of bridge network mode.

```
huong@py:~$ docker network ls
NETWORK ID     NAME                                                DRIVER    SCOPE
07d4bc0d9391   bridge                                              bridge    local
9de1de6483bc   cf-example-manage-mongodb_default                   bridge    local
3d4c34f26618   composetest_default                                 bridge    local
65373d504780   docker-compose-prometheus-and-grafana_monitor-net   bridge    local

```
 
- Bridge mode is the default network mode of docker. If you do not write the – net parameter, it is the bridge mode. When docker run – P is used, docker actually makes DNAT rules in iptables to realize port forwarding function..
- When the docker process starts, by default, a virtual bridge named docker0 will be created on the host, and the docker container started on this host will be connected to the virtual bridge. The virtual bridge works like a physical switch, so that all containers on the host are connected to a layer-2 network through the switch.
- The Docker bridge driver automatically installs rules in the host machine so that containers on different bridge networks cannot communicate directly with each other.
- The docker then assigns an IP address from the docker 0 subnet to the container, and set the docker 0 IP address as the default gateway of the container. Create a pair of virtual network card Veth pair devices on the host. Docker puts one end of the Veth pair device in the newly created container and names it eth0 (network card of the container). The other end is placed in the host and named after vethxxx. The network device is added to the docker 0 bridge. It can be viewed through the brctl show command.
<div align="center">
  <img src="imgs/anh1.png">
</div>

I have just build an ubuntu image, then create a container in bridge networking mode. 


- User-defined bridge networks are superior to the default bridge network.

|                                      | _Default bridge network_                                                                                                                                                                                                                                               | _User – defined network_                                                                                                                   |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| _DNS_                                | Containers get access to each other only by IP addresses if not use the --link option.                                                                                                                                                                                 | Containers can get access to each other by name or alias because User–defined network provide automatic DNS resolution between containers. |
| _Isolation_                          | It’s obligatory to create links between the containers (using the legacy --link flag) if there are same running application stacks on the default bridge network. Otherwise, unrelated stacks/services/containers are then able to communicate your defined container. | User-defined network provides a scoped network in which only containers attached to that network are able to communicate.                  |
| _Attaching and detaching container_ | Stop the container and recreate it with different network options.                                                                                                                                                                                                     | You only need to use connect and disconnect command.                                                                                       |                                                                                      |



To configure the default bridge network, you specify options in daemon.json. Here is an example daemon.json with several options specified. Only specify the settings you need to customize. Then restart docker. 

```
{
  "bip": "192.168.1.31/24",
  "fixed-cidr": "192.168.1.0/24",
  "mtu": 1500,
  "default-gateway": "192.168.1.254",
  "dns": ["10.20.1.2","10.20.1.3"]
}
```
### 2. Host mode

```
huong@py:~$ docker network ls
NETWORK ID     NAME                                                DRIVER    SCOPE
ce05b1b269f3   host                                                host      local
```

- If the container is started in host mode, the container will not get a separate network namespace, but share a network namespace with the host. The container will not virtual out its own network card, configure its own IP, etc., but use the host’s IP and port. However, other aspects of the container, such as the file system, process list, and so on, are isolated from the host. When using host mode networking, port-mapping does not take effect.
- The container using the host mode can use the host’s IP address to communicate with the outside world, and the service port inside the container can also use the host’s port without NAT. The biggest advantage of host is that the network performance is better, but the ports already used on docker host can’t be used again, and the network isolation is not good.

<div align="center">
  <img src="imgs/anh2.png">
</div>

> **_NOTE:_** <em>The host networking driver only works on Linux hosts, and is not supported on Docker Desktop for Mac, Docker Desktop for Windows, or Docker EE for Windows Server.</em>

### 3. None mode

```
huong@py:~$ docker network ls
NETWORK ID     NAME                                                DRIVER    SCOPE
d2e1ce5085e8   none                                                null      local
```
- Using the none mode, the docker container has its own network namespace. However, there is no network configuration for the docker container. In other words, the docker container does not have network card, IP, routing and other information. We need to add network card and configure IP for docker container.
- In this network mode, the container only has a lo loopback network and no other network card. The none mode can be specified by – network = none when the container is created. This type of network has no way to network, closed network can ensure the security of the container.
- none mode is not available for swarm services.

<div align="center">
  <img src="imgs/anh3.png">
</div>

### 4. Container mode

- This pattern specifies that the newly created container shares a network namespace with an existing container, rather than with the host. The newly created container will not create its own network card and configure its own IP. Instead, it will share IP and port range with a specified container. Similarly, the two containers are isolated from each other, such as file system, process list, and so on. The processes of the two containers can communicate through the lo network card device.

<div align="center">
  <img src="imgs/anh4.png">
</div>

To consolidate the 4 modes, see the following table: 

| _Docker network mode_ | _How to configure_           | _Explain_                                                                                                                                                                         | _When using_                                                                                                                                                                                                                                                                                   |
|-----------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Bridge mode**       | --net = bridge               | (default to this mode)                                                                                                                                                            | when you need multiple containers to communicate on the same Docker host.                                                                                                                                                                                                                      |
| **Host mode**         | --net = host                 | The container and the host share the network namespace.                                                                                                                           | when the network stack should not be isolated from the Docker host, but you want other aspects of the container to be isolated.                                                                                                                                                                |
| **None mode**         | --net= none                  | The container has an independent network namespace, but it does not have any network settings for it, such as assigning the Veth pair and bridge connection, configuring IP, etc. | - Run batch jobs<br>- Testing containers<br>- Preparing a container for network connection<br>- Containers that do not need external network                                                                                                                                                   |
| **Container mode**    | --net = container:name or ID | The container shares the network namespace with another container.                                                                                                                | - Perform diagnostics on a running container and the container is missing the necessary diagnostic tools (e.g., curl or dig). <br>- A temporary container with the necessary diagnostics tools may be created and attached to the first container’s network.<br>- Emulate pod-style networking |

I have found in some document that "</em> there are 2 other modes: overlay and underlay </em>", but I think, they are only two types of network used in User-defined network mode. We will shed light on these later.

## II. How does docker-compose provide networking for its services

### 1. Create default docker-compode network 
- By default Compose create a single network for your app. All your containers for all services connect to the default network and can access other containers on this network, as well as are discoverable by them at a hostname identical to the container name. 
- Your app’s network by default is given a name based on the “project name”, which is based on the name of the directory it lives in. The project name can be overrided with either the --project-name flag or the COMPOSE_PROJECT_NAME environment variable.
 
<div align="center">
  <img src="imgs/anh11.png">
</div>  

In previous example, I run a compose file in folder Building_web and I do not write any code lines to define a new network, so the network will be created by default with the name: building_web_default, the driver is </em> Bridge</em>, as well.
Any container that gets connected to this network will get an IP in the range from 172.30.0.2 to 172.18.255.254. 

Compose also allows defining your own network definition. This would include options for the subnet mask, IPv6 addresses, among other things. The way it is done is that we have top-level networks just like services or versions are top-level keys. For instance:

```
# services declarations...

networks:
  my-network:
    driver: bridge
```
### 2. Update docker-compose network

If you change configuration to a service and run docker-compose up to update it, the old container is removed and the new one joins the network under a different IP address but the same name. Running containers can look up that name and connect to the new address, but the old address stops working.If you make a configuration change to a service and run docker-compose up to update it, the old container is removed and the new one joins the network under a different IP address but the same name. Running containers can look up that name and connect to the new address, but the old address stops working.

If any containers have connections open to the old container, they are closed. It is a container’s responsibility to detect this condition, look up the name again and reconnect.

## III.How does docker swarm do multihost networking?

### 1. What is Docker Swarm?

<div align="center">
  <img src="imgs/anh7.png">
</div>   


Docker Swarm is the docker native clustering solution that turns a pool of Docker hosts into a single virtual server allowing clustering with the built-in Swarm orchestration.The Docker Swarm follows a decentralised design where nodes can handle any role in the cluster. The node specialisations to managers and workers are chosen at runtime. As the cluster must have at least one manager, the first node initializing the cluster is assigned as such. 
2 types of nodes:\
      ◦ Manager - Manager nodes perform the orchestration and cluster management functions required to maintain the desired state of the swarm. Manager nodes elect a single leader to conduct orchestration tasks.\
      ◦ Worker - Worker nodes receive and execute tasks dispatched from manager nodes. By default, manager nodes are also worker nodes, but you can configure managers to be manager-only nodes.
Subsequent nodes joining the cluster are usually added as workers but can be assigned as either. The flexibility means that the entire swarm can be built from a single disk image with little differentiation.


The following port must be opened while working on docker swarm mode:\
      ◦ 2377 (TCP) - Cluster management\
      ◦ 7946 (TCP and UDP) - Nodes communication\
      ◦ 4789 (TCP and UDP) - Overlay network traffic
Docker swarm seems to be the same as Kuberetes because both platforms allow you to manage containers and scale application deployment, but kubernetes is much more comlplex. In Swarm, a service provides both scheduling and networking facilities, creating containers and providing tools for routing traffic to them. In Kubernetes, scheduling and networking are handled separately: deployments (or other controllers) handle the scheduling of containers as pods, while services are responsible only for adding networking features to those pods.
 
 Docker-compose is single-node swarm.

 The swarm nodes enforce TLS authentication and encryption to secure communication between nodes. All of this is done by default and requires no additional attention. It is also possible to use self-signed root certificates, but for most cases, it is fine to go with the default implementation. 

<div align="center">
  <img src="imgs/anh9.png">
</div> 

Using TLS authentication to secure communication between nodes is an efficient security solution on doing networking. 

### 2. Overlay network

Overlays use networking tunnels to deliver communication across hosts. This allows containers to behave as if they are on the same machine by tunneling network subnets from one host to the next; in essence, spanning one network across multiple hosts. Many tunneling technologies exist, such as virtual extensible local area network (VXLAN).

Overlay networks could be private ones, or even public infrastructure on Cloud. The essential point is, if there are two hosts, each running Docker, then the Overlay network helps create a subnet which is overlaid on top of these two hosts and each Docker container connected to this overlay network can communicate with every other container using their own block of IP address, subnet and default gateway. As though they are part of the same network.

<div align="center">
  <img src="imgs/anh8.png">
</div> 

The figure above illustrates an example about overlay network that I imagined. The two host are running docker, with containers attached to overlay network. The overlay network is “overlaid” and containers will get IP address like 172.18.0.2, 172.18.0.3, etc on this network. Regardless of the host running them or the host's own network configuration.

To answer the question that How does docker swarm do multihost networking?, the answer is using overlay network. 

### 3. Networking in the Swarm

The swarm manages multi-host networking which supports overlay network services. The cluster manager automatically assigns virtual IP addresses to the containers that join the overlay. The swarm runs an embedded DNS server, which makes it possible for the swarm to also assign each container a unique DNS name that is resolvable from any container within the overlay network. This greatly simplifies service discovery and allows load balancing from the get-go.

<div align="center">
  <img src="imgs/anh10.png">
</div> 


The following two network concepts is also important to swarm services:

- ingress network is a special overlay network that facilitates load balancing among a service’s nodes. When any swarm node receives a request on a published port, it hands that request off to a module called IPVS. IPVS keeps track of all the IP addresses participating in that service, selects one of them, and routes the request to it, over the ingress network. The ingress network is created automatically when you initialize or join a swarm. Most users do not need to customize its configuration, but Docker allows you to do so.

- docker_gwbridge is a bridge network that connects the overlay networks (including the ingress network) to an individual Docker daemon’s physical network. By default, each container a service is running is connected to its local Docker daemon host’s docker_gwbridge network. The docker_gwbridge network is created automatically when you initialize or join a swarm. Most users do not need to customize its configuration, but Docker allows you to do so.



## References

- [Docker Swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/)
- [Handson Docker Swarm](https://docs.docker.com/get-started/swarm-deploy/#prerequisites)
- [Overlay network](https://docs.docker.com/network/network-tutorial-overlay/)
- [Docker compose networking](https://docs.docker.com/compose/networking/)

