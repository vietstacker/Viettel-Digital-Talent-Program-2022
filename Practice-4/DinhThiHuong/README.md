# MONITORING

## Table of contents
  - [I. Basic Knowledge](#i-basic-knowledge)
  - [II. Practice](#ii-practice)
  - [III. References](#iii-references)


## I. Basic Knowledge


### 1. Prometheus

- Prometheus is an open-source systems monitoring and alerting toolkit originally built at SoundCloud. 
- Prometheus collects and stores its metrics as time series data, i.e. metrics information is stored with the timestamp at which it was recorded, alongside optional key-value pairs called labels.

- Architecture: 
 <img src="imgs/architecture.png">

 - Components: 
  - Prometheus server: scrapes and stores time series data
  - client libraries: instrumentes application code
  - push gateway: supports short-lived jobs. These tasks do not exist long enough for server to pull metrics. So, at first, metrics are pushed to push gateway and then pulled by Prometheus server.
  - exporters: fetch statistics from the system and sent data to Prome sever as expected.
  - alertmanager:  handle alerts

### 2. Exporter
- Exporters are apps written for common things like Database, Server. We just need to run it and it will export the collected metrics for us.
- Some of the common exporters: 
  - Prometheus: prometheus itself also has a built-in exporter, which exports metrics about service prometheus at URI: http://prometheus.lc:9090/metrics
  - cAdvisor (container advisor): export metrics of docker services, processes on the server.
  - Node Exporter: export metrics of a node (understood as a server) such as the node's CPU, RAM, disk space, number of requests to that node, .etc.
  - Postgres Exporter, which reads data from Postgres tables and exports it to Prometheus
  - HAProxy Exporter

### 3. Grafana

 <img src="imgs/Grafana.png">

- Grafana is a multi-platform open source analytics and interactive visualization web application. Grafana allows you to query, visualize, alert on and understand your metrics no matter where they are stored. Create, explore, and share beautiful dashboards with your team and foster a data driven culture.

- Grafana also enables us to write plugins from scratch for integration with several data sources. These are some useful features of Grafana:

  - Time series analytics: Study, analyse and monitor data over period of time.

  - Tracking behaviour: Track the user behaviour, application behaviour, frequency of errors popping up in production or a pre-prod environment, type of errors popping up & the contextual scenarios by providing relative data.

  - On-prem deployed: our data will not be streamed to the third party organization or vendor cloud, but it will be self deployed by us.

### 4. Alerting
- The Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.
- Alerting with Prometheus is separated into two parts. Alerting rules in Prometheus servers send alerts to an Alertmanager. The Alertmanager then manages those alerts, including silencing, inhibition, aggregation and sending out notifications via methods such as email, on-call notification systems, and chat platforms.
- The main steps to setting up alerting and notifications are:
  - Setup and configure the Alertmanage
  - Configure Prometheus to talk to the Alertmanager
  - Create alerting rules in Prometheus  


## II. Practice


**Assignment:**
  - Deploy stack Prometheus + Exporter + Alertmanager + Grafana
    - Using docker, docker-compose, ansible to deploy
    - Bonus: run Prometheus + Alertmanager in a high availability
  - Deﬁne alert rules to monitoring host, containers…
  - Conﬁgure alertmanager to push alert to mail (or slack, telegram…)
  - Create the dashboards Grafana to monitoring host, container,..


**1. Prometheus Config**
- Prometheus configuration file `prometheus.yml`:
```
global:
  scrape_interval: 15s 
  evaluation_interval: 15s 

rule_files:
  - 'alert.rules.yml'

scrape_configs: 
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
     - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    scrape_interval: 15s
    static_configs:
      - targets: ['nodeexporter:9100']

alerting:
  alertmanagers:
  - scheme: http
    static_configs:
    - targets: 
      - 'alertmanager:9093'
      - '192.168.1.176:9093'
```

- Create file `alert.rules.yml` containing alerting rules in the same directory:
```
groups:
- name: targets
  rules:
  - alert: service_down
    expr: up == 0
    for: 15s
    labels:
      severity: "critical"
    annotations:
      summary: "{{ $labels.instance }} is down"
      description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minutes."

- name: host
  rules:
  - alert: host_out_of_memory
    expr: node_memory_MemAvailable / node_memory_MemTotal * 100 < 25
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "{{ $labels.instance }} runs out of memory"
      description: "Node memory is filling up (< 25% left)\n  VALUE = {{ $value }}\n  LABELS: {{ $labels }}"


  - alert: host_out_of_disk_space
    expr: (node_filesystem_avail{mountpoint="/"}  * 100) / node_filesystem_size{mountpoint="/"} < 50
    for: 1s
    labels:
      severity: warning
    annotations:
      summary: "{{ $labels.instance }} runs out of disk space"
      description: "Disk is almost full (< 50% left)\n  VALUE = {{ $value }}\n  LABELS: {{ $labels }}"


  - alert: host_high_cpu_load
    expr: node_load1 > 1.5
    for: 30s
    labels:
      severity: warning
    annotations:
      summary: "{{ $labels.instance }} high cpu load"
      description: "Host is under high load, the avg load 1m is at {{ $value}}. Reported by instance {{ $labels.instance }} of job {{ $labels.job }}."
```

- Explain details: There are 4 main blocks: 
  - global: Global Prometheus config defaults. 
    - scrape_interval: 15s : Set the scrape interval to every 15 seconds. Default is every 1 minute.
    - evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  - rule_files: to list files that define alert rule.
  - scrape_configs: Defined scrape jobs. In this lab, I scape metrics from prometheus, docker container.
  - alerting: access to alertmanager via default port: 9093


- For high avalibility, I configure Alert Manager to run in a 2-node cluster including my VM and my host (192.168.1.176).


**2. Alert Manager Config**
- Create folder named `alertmanager` then write configuration file `config.yml` inside:
```
route:
    receiver: 'slack'

receivers:
    - name: 'slack'
      slack_configs:
          - send_resolved: true
            text: "{{ .CommonAnnotations.description }}"
            username: 'rdinh522'
            channel: '#head-in-the-clouds'    # The channel or user to send notifications to.
            api_url: 'https://hooks.slack.com/services/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'
```

- In this lab, I will sent alert via Slack. Slack notifications are sent via Slack webhooks. To get `api_url`, let's create a new app then pick a workspace and a channel to sent alert to.

<img src="imgs/slackapp.png">


<img src="imgs/slackurl.png">


**3. docker-compose file**
```
version: '3'

services:
  prometheus:
    image: prom/prometheus:v2.17.1
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus
    restart: unless-stopped
    ports:
      - 9090:9090
    expose:
      - 9090
    networks:
      - monitor-net

  alertmanager:
    image: prom/alertmanager:v0.20.0
    container_name: alertmanager
    command:
      - '--config.file=/etc/alertmanager/config.yml'
      - '--cluster-peer=192.168.1.176:9093'
    volumes:
      - ./alertmanager:/etc/alertmanager
    restart: unless-stopped
    ports:
      - 9093:9093
    networks:
      - monitor-net

  nodeexporter:
    image: prom/node-exporter:v0.18.1
    container_name: nodeexporter
    command:
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
    restart: unless-stopped
    ports:
      - 9100:9100
    networks:
      - monitor-net

  grafana:
    image: grafana/grafana:6.7.2
    container_name: grafana
    restart: unless-stopped
    ports:
      - 3000:3000
    networks:
      - monitor-net

networks:
  monitor-net:
    driver: bridge
```

- Docker can produce a lot of churn if there's a crashloop and the filesystems themselves should already already covered, so those paths are ignored out of the box by flag --collector.filesystem.ignored-mount-points.


**4. Ansible Playbooks**
- In this lab, I will utilize the VM and inventory file from [my previous practice 2](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/tree/main/Practice-2/Dinh-Thi-Huong)

- Ansible playbook `playbook.yml`:
```
---
- name: Install docker
  hosts: servers
  become: yes
  roles:
  - docker

- name: Deploy monitoring system
  hosts: servers
  become: yes
  roles:
  - deploy
```

- Create `roles` directory follow my reposity structure. For details, `files` contains static files to be copied to nodes and `tasks` contains actions to take, using modules.

- Role `docker` to install Docker and Docker compose in my VM:
```
---
- name: Install aptitude
  apt:
    name: aptitude
    state: latest
    update_cache: true

- name: Install required system packages
  apt:
    pkg:
      - apt-transport-https
      - ca-certificates
      - curl
      - software-properties-common
      - python3-pip
      - virtualenv
      - python3-setuptools
    state: latest
    update_cache: true

- name: Add Docker GPG apt Key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present

- name: Add Docker Repository
  apt_repository:
    repo: deb https://download.docker.com/linux/ubuntu focal stable
    state: present

- name: Update apt and install docker-ce
  apt:
    name: docker-ce
    state: latest
    update_cache: true

- name: Install Docker, Docker Compose Modules for Python
  pip:
    name: 
      - docker
      - docker-compose
```

- Role `deploy` to deploy monitoring system:
```
---
- name: copy Docker Compose files
  copy:
    src: files/
    dest: /tmp/

- name: deploy Docker Compose stack
  community.docker.docker_compose:
    project_src: /tmp
    files:
    - docker-compose.yml
```

- By default, roles directoy is in */etc/ansible/roles*. I will custom location of roles by setting **roles_path** setting in the default section of `ansible.cfg` file:
```
[defaults]
roles_path = ./roles
```

**5. Delployment**
- Run `ansible-playbook` to start our system
```
ansible-playbook -i inventory playbook.yml -K
```

**6. Result**
- Run successfully playbook:


<img src="imgs/run-playbook.png">


- Check Alertmanager in high availability:


<img src="imgs/ha.png">


- Check container status:


<img src="imgs/dockerps.png">


<img src="imgs/dockerlogs.png">


- To check the alertmanager works fine, I try stopping container **nodeexporter**:
```
docker container stop nodeexporter 
```

<img src="imgs/alertmanager.png">


<img src="imgs/slackalert.png">


- Access Grafana Dashboard via port 3000 then enter `admin` for username and password.

<img src="imgs/login.png">

- Create new datasource Prometheus, enter url **http://prometheus:9090**:
<img src="imgs/datasource.png">

- It's your creative time to visualize metrics :))

<img src="imgs/visualize.png">


## III. References
- [Prometheus docs](https://prometheus.io/docs/introduction/overview/)

- [How to Use Ansible to Install and Set Up Docker on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-docker-on-ubuntu-20-04)

- [How to run docker-compose commands with ansible?](https://stackoverflow.com/questions/62452039/how-to-run-docker-compose-commands-with-ansible)

- [Send Message to a Private Channel with Slack API](https://pipedream.com/apps/github/integrations/slack/send-message-to-a-private-channel-with-slack-api-on-new-review-request-from-github-api-int_EzsEEr)
