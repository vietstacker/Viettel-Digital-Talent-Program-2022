# MONITORING

## Table of contents
  - [I. Basic Knowledge](#i-basic-knowledge)
  - [II. Practice](#ii-practice)
  - [III. References](#iii-references)


## I. Basic Knowledge


### 1. Prometheus

- Prometheus is an open-source systems monitoring and alerting toolkit originally built at SoundCloud. 
- Prometheus collects and stores its metrics as time series data, i.e. metrics information is stored with the timestamp at which it was recorded, alongside optional key-value pairs called labels.
- Components: 
  - Prometheus server: scrapes and stores time series data
  - client libraries: instrumentes application code
  - push gateway: supports short-lived jobs. These tasks do not exist long enough for server to pull metrics. So, at first, metrics are pushed to push gateway and then pulled by Prometheus server.
  - exporters: fetch statistics from the system and sent data to Prome sever as expected.
  - alertmanager:  handle alerts
- Architecture: 
 <img src="imgs/prometheus.png">

### 2. Exporter
- Exporters are apps written for common things like Database, Server. We just need to run it and it will export the collected metrics for us.
- Some of the common exporters: 
  - Prometheus: prometheus itself also has a built-in exporter, which exports metrics about service prometheus at URI: http://prometheus.lc:9090/metrics
  - cAdvisor (container advisor): export metrics of docker services, processes on the server.
  - Node Exporter: export metrics of a node (understood as a server) such as the node's CPU, RAM, disk space, number of requests to that node, .etc.
  - Postgres Exporter, which reads data from Postgres tables and exports it to Prometheus
  - HAProxy Exporter

### 3. Grafana

 <img src="imgs/grafana.png">

- Grafana is a multi-platform open source analytics and interactive visualization web application. Grafana allows you to query, visualize, alert on and understand your metrics no matter where they are stored. Create, explore, and share beautiful dashboards with your team and foster a data driven culture.

- The two parts of Grafana, front end and back end are written in TypeScript and Go, respectively.

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


Here is my reposity structure:
<img src="imgs/repo.png">


**1. Deploy Prometheus**
- Create folder named `prometheus` and write Prometheus configuration file `prometheus.yml` inside:
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


**2. Deploy alertmanager**
- Create folder named `alertmanager` then write configuration file `config.yml` inside:
- In this lab, I will sent alert via Slack. Slack notifications are sent via Slack webhooks.
```
route:
    receiver: 'slack'
receivers:
    - name: 'slack'
      slack_configs:
          - send_resolved: true
            text: "{{ .CommonAnnotations.description }}"
            username: 'Prometheus'
            channel: '#general'    # The channel or user to send notifications to.
            api_url: 'https://hooks.slack.com/services/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'
```


**3. Deploy node-exporter**
```
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
```
- Docker can produce a lot of churn if there's a crashloop and the filesystems themselves should already already covered, so those paths are ignored out of the box by flag --collector.filesystem.ignored-mount-points


**4. Deploy Grafana**
- To create Grafana container: 
```
  grafana:
    image: grafana/grafana:6.7.2
    container_name: grafana
    restart: unless-stopped
    ports:
      - 3000:3000
    networks:
      - monitor-net
```


**5. Result**


## III. References
