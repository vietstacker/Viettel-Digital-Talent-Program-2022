# MONITORING

## Content 
  - [Content]()
  - [I. Overview]()
  - [II. Deploy Prometheus, Grafana, Exporter, Alert Manager using Docker-compose]()
  - [III. Deploy Prometheus, Grafana, Exporter, Alert Manager using Docker-compose ansible ]()
  - [References]()

---

## I. Overview

Initially, I would like to express my thankfulness to all mentors and other attendees that help me understand this subject as well as fix silly bugs. :kissing_closed_eyes:

**1. Prometheus**  

- Prometheus is an open-source systems monitoring and alerting toolkit originally built at SoundCloud. 
- Prometheus collects and stores its metrics as time series data, i.e. metrics information is stored with the timestamp at which it was recorded, alongside optional key-value pairs called labels.
- Components: 
  - Prometheus server: scrapes and stores time series data
  - client libraries: instrumentes application code
  - push gateway: supports short-lived jobs. These tasks do not exist long enough for server to pull metrics. So, at first, metrics are pushed to push gateway and then pulled by Prometheus server.
  - exporters: fetch statistics from the system and sent data to Prome sever as expected.
  - alertmanager:  handle alerts
- Architecture: 
 <img src="imgs/anh1.png">

**2. Exporter**
- Exporters are apps written for common things like Database, Server. We just need to run it and it will export the collected metrics for us.
- Some of the common exporters: 
  - Prometheus: prometheus itself also has a built-in exporter, which exports metrics about service prometheus at URI: http://prometheus.lc:9090/metrics
  - cAdvisor (container advisor): export metrics of docker services, processes on the server.
  - Node Exporter: export metrics of a node (understood as a server) such as the node's CPU, RAM, disk space, number of requests to that node, .etc.
  - Postgres Exporter, which reads data from Postgres tables and exports it to Prometheus
  - HAProxy Exporter

**3. Grafana**

 <img src="imgs/anh2.png">

- Grafana is a multi-platform open source analytics and interactive visualization web application. Grafana allows you to query, visualize, alert on and understand your metrics no matter where they are stored. Create, explore, and share beautiful dashboards with your team and foster a data driven culture.

- The two parts of Grafana, front end and back end are written in TypeScript and Go, respectively.

***4. Alerting**
- The Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.
- Alerting with Prometheus is separated into two parts. Alerting rules in Prometheus servers send alerts to an Alertmanager. The Alertmanager then manages those alerts, including silencing, inhibition, aggregation and sending out notifications via methods such as email, on-call notification systems, and chat platforms.

- The main steps to setting up alerting and notifications are:

  - Setup and configure the Alertmanage
  - Configure Prometheus to talk to the Alertmanager
  - Create alerting rules in Prometheus  
## II. Deploy Prometheus, Grafana, Exporter, Alert Manager using Docker-compose

**1. Deploy Prometheus**

- First of all, write Prometheus configuration file: prometheus.yml:
```
global:
  scrape_interval:     15s
  evaluation_interval: 15s
  
rule_files:
  - "alert.rules"
scrape_configs:
  - job_name: 'nodeexporter'
    scrape_interval: 5s
    static_configs:
      - targets: ['nodeexporter:9100']

  - job_name: 'cadvisor'
    scrape_interval: 5s
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'prometheus'
    scrape_interval: 10s
    static_configs:
      - targets: ['localhost:9090']

alerting:
  alertmanagers:
  - scheme: http
    static_configs:
    - targets: 
      - 'alertmanager:9093'
```
- Let's take a glance at the above yaml file: 
  - global: Global Prometheus config defaults. 
    - scrape_interval: 15s : Set the scrape interval to every 15 seconds. Default is every 1 minute.
    - evaluation_interval: 15s : Evaluate rules every 15 seconds. The default is every 1 minute.
  - rule_files: to list files that define alert rule. I will talk about th rule file later. 
  - scrape_configs: Defined scrape jobs. In this lab, I scape metrics from prometheus, docker container.
  - alerting: access to alertmanager via default port: 9093
-  Add alert rule: 
```
groups:
- name: targets
  rules:
  - alert: monitor_service_down
    expr: up == 0
    for: 30s
    labels:
      severity: critical
    annotations:
      summary: "Monitor service non-operational"
      description: "Service {{ $labels.instance }} is down."

- name: host
  rules:
  - alert: high_cpu_load
    expr: node_load1 > 1.5
    for: 30s
    labels:
      severity: warning
    annotations:
      summary: "Haizzz"
      description: "Docker host is under high load."


```
- To create a prometheus container, I pull an image from Dockerhub.
```
  prometheus:
    image: prom/prometheus:v2.17.1
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    ports:
      - 9090:9090
    networks:
      - monitoring
```
- --storage.tsdb.path: Where Prometheus writes its database. In this lab, it writes data to directory /prometheus
- --storage.tsdb.retention.time: When to remove old data. Defaults to 15d. In this lab, I set it to 200 hours.
- Consoles are exposed on /consoles/, and sourced from /etc/prometheus/consoles
- Consoles have access to all the templates defined with {{define "templateName"}}...{{end}} found in *.lib files in /etc/prometheus/console_libraries
- - 9090:9090: we will access to prometheus via http:<host_ip>:9090, in condition of allowing port 9090 in local machine. 


**2. Deploy alertmanager**

- In this lab, I choose to send the alert massage via stack. Slack notifications are sent via Slack webhooks. First, create a new app and then get the api_url to send alert to. 
  - Create an app named: practice4 and pick a workspace. In this lab, I use my created workspace: HUST
 <img src="imgs/anh20.png">

  - Copy the link and put it into the alertmanager configurationn file. 
  <img src="imgs/anh21.png">

- Afterwards, write configuration file: config.yml:

```
route:
    receiver: 'slack'

receivers:
    - name: 'slack'
      slack_configs:
          - send_resolved: true
            text: "{{ .CommonAnnotations.description }}"
            username: 'huong.set'
            channel: '#practice4'    # The channel or user to send notifications to.
            api_url: 'https://hooks.slack.com/services/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'
```
- To create a alertmanager instance, I pull an image from Dockerhub.

```
  alertmanager:
    image: prom/alertmanager:v0.20.0
    container_name: alertmanager
    volumes:
      - ./alertmanager:/etc/alertmanager
    command:
      - '--config.file=/etc/alertmanager/config.yml'
      - '--storage.path=/alertmanager'
    restart: unless-stopped
    ports:
      - 9093:9093
    networks:
      - monitoring
```

**3. Deploy node-exporter**

```
  nodeexporter:
    image: prom/node-exporter:v0.18.1
    container_name: nodeexporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
    restart: unless-stopped
    ports:
      - 9100:9100
    networks:
      - monitoring
```
- For the node-exporter service, I mount some necessary paths from the host into the container in read-only mode:
```
/proc
/sys
/
```
- Docker can produce a lot of churn if there's a crashloop and the filesystems themselves should already already covered, so those paths are ignored out of the box by flag --collector.filesystem.ignored-mount-points

**4. Deploy cadvisor**

```
  cadvisor:
    image: gcr.io/google-containers/cadvisor:v0.34.0
    container_name: cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    restart: unless-stopped
    ports:
      - 8080:8080
    networks:
      - monitoring
    labels:
      org.label-schema.group: "monitoring"

```
**5. Deploy Grafana**

- Create a configuaration file: datasource.yml 

```
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    url: http://prometheus:9090
    basicAuth: false
    isDefault: true
    editable: true
```
- To create Grafana container: 

```
  grafana:
    image: grafana/grafana:6.7.2
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_USER=${ADMIN_USER}
      - GF_SECURITY_ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    restart: unless-stopped
    ports:
      - 3000:3000
    networks:
      - monitoring
```
**6. Result**
- docker-compose up to build images and create containers. Then we examine the result:
 <img src="imgs/anh3.png"> 

- To verfify my setup, let check the container logs:
```
docker logs <container_name>
```
- Here is expected result:
 <img src="imgs/anh24.png"> 

- Now, access to the local host and repective port: 
  - Access Prometheus via port 9090
 <img src="imgs/anh4.png">

  - Access Grafana via port 3000
 <img src="imgs/anh5.png">
 
  - Then login with user: admin and password: admin: 
 <img src="imgs/anh6.png">
 
  - Then choose a dashboard to examine the metrics: 
 <img src="imgs/anh35.png">
 
  - Let's rejoice :)))

 <img src="imgs/anh8.png">
 
 <img src="imgs/anh9.png">
 
 <img src="imgs/anh10.png">
 
 <img src="imgs/anh12.png">
 
 <img src="imgs/anh29.png">
 
 <img src="imgs/anh23.png">

 <img src="imgs/anh25.png">
  
  - Alertmanager: 
 <img src="imgs/anh7.png">

- Access to webhooks to examine the sent alert: 

 <img src="imgs/anh22.png">

 <img src="imgs/anh33.png">

## References

- [Prompose example](https://github.com/ntk148v/prompose)
- [Prometheus configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- [Send Message to a Private Channel with Slack API](https://pipedream.com/apps/github/integrations/slack/send-message-to-a-private-channel-with-slack-api-on-new-review-request-from-github-api-int_EzsEEr)
- [Prometheus documentations](https://prometheus.io/docs/introduction/overview/)
- [Prometheus exporter](https://alanstorm.com/what-are-prometheus-exporters/#:~:text=A%20Prometheus%20Exporter%20is%20a,URL%20display%20the%20system%20metrics)
- [Sending messages using Incoming Webhooks](https://api.slack.com/messaging/webhooks#getting_started)

- [Sending messages using Incoming Webhooks - video youtube for lazy people](https://www.youtube.com/watch?v=6NJuntZSJVA)

