# Practice 4: Deploy stack Prometheus + Exporter + Alertmanager + Grafana


Author: **Vo Minh Thien Long**

----        
## Table of contents
[I. Requirement](#requirement)

[II. Prerequisites knowledge](#knowledge)
- [1. Monitoring](#monitoring)
- [2. Prometheus](#prometheus)
- [3. Alertmanager](#alertmanager)
- [4. Grafana](#grafana)

[III. Prerequisites knowledge](#hardware)
- [1. Overview](#hardware-overview)
- [2. Monitor machine](#monitor-machine)
- [3. Node machines](#node-machines)

[IV. Configurations](#configurations)
- [1. Using Ansbile to configurate monitor and node machines](#setup-ansible)
- [2. Prometheus configuration](#setup-prometheus)
- [3. Set alert rules](#setup-alert-rules)
- [4. Alertmanager configuration](#setup-alertmanager)
- [5. Using Docker to deploy Prometheus, Grafana and Alertmanager](#setup-docker)

[V. Deployment](#deployment)
- [1. Run `ansible-playbook` to setting up our minitor and node machines](#deployment-ansible)
- [2. Run `docker compose` to start our Prometheus, Alertmanager and Grafana](#deployment-docker)
- [3. Generate alerts](#deployment-generate)

[VI. Additional: High Availability Alertmanager](#additional)
- [1. Set up a new EC2 instance](#set-up-ha)
- [2. Test our High availability Alertmanager](#test-ha)

[VII. References](#references)

---- 

## I. Requirements
<a name='requirement'></a>

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

#### 1.4. Monitoring, Logging and Tracing

**Logging** is used to represent state transformations within an application.
It is **immutable**, **timestamped** record of discrete events in 3 forms: Plaintext, Structured and Binary.
When things go wrong, we need logs to establish what change in state caused the error.

**Tracing** is following a program’s flow and data progression. A **trace** represents a single user’s journey through 
an entire stack of an application. It is often used for **optimisation purposes**. 

→ **Monitoring** != **Logging** != **Tracing**.

### 2. Prometheus
<a name='prometheus'></a>

#### 2.1. Overview

**Prometheus** is an **open-source** systems _monitoring_ and _alerting_ toolkit originally built at 
SoundCloud in 2012. The project is written in **Go** and licensed under the **Apache 2 License**, with source code available on 
[GitHub](https://github.com/prometheus/prometheus).

**Prometheus** has a very active developer and user community. It is now a standalone open source project 
and maintained independently of any company. In 2016, **Prometheus** joined the Cloud Native Computing 
Foundation as the second hosted project, after Kubernetes.

<div align="center">
  <img width="200" src="assets/prometheus-logo.png" alt="Prometheus logo">
</div>

<div align="center">
  <i>Prometheus logo.</i>
</div>

#### 2.2. Architecture

The Prometheus ecosystem consists of multiple components, many of which are optional:

- **Prometheus server**
  - **Service Discovery**: helps **Prometheus** automatically scrape dynamic `targets`.
  - **Rules và Alerts**: we use `PromQL` to define **rules** and **Prometheus server** to compute and evaluate `metrics` based on
defined rules. In the other hand, Prometheus server also take the responsibility push `alerts` to **Alertmanager**.
  - **Storage**: to store metrics which were scraped by Prometheus server in a `time series` database.


- **Exporter**: is the component used in the `target` we want to monitor. **Expoter** collects and
pull the metrics as a endpoint for the Prometheus server scraping. 


- **Alertmanager** (`optional`): to process and handle the `alerts` from the **Prometheus server**. 
It also takes care of `deduplicating`, `grouping` and `routing` alert to the receivers.
**Alertmanager** can send the notifications through: email, service (PagerDuty), chat (Slack, Telegram) or web hooks. 
Besides that, **Alertmanager** can also use to `silence` or `inhibition` the specific `alerts`.


- **Web UI & Visualizations** (`optional`): Although Prometheus web app we usually use web app includes a _built-in utility_ 
- it describes as an `expression browser`, we usually **Grafana** for Dashboard, in order to display and visualize metrics 
value in the chart type's format.


- **Push gateway** (`optional`): for supporting short-lived jobs. Although Prometheus is a primarily **pull-based** 
monitoring system, **Push gateway** is available for pushing metrics from external applications and services. 
The **Pushgateway** is useful for collecting metrics that are not compatible with the otherwise 
pull-based infrastructure (short-lived jobs).

Most of these components are written in **Go**, making them easy to build and deploy as static binaries.

<div align="center">
  <img width="1500" src="assets/prometheus-architecture.png" alt="Prometheus architecture">
</div>

<div align="center">
  <i>Prometheus and some of its ecosystem components.</i>
</div>

Prometheus scrapes **metrics** from instrumented **jobs**, either directly or via an intermediary **push gateway** 
for short-lived jobs. It stores all scraped samples locally and runs rules over this data to either _aggregate_ 
and _record_ new time series from existing data or _generate alerts_. **Grafana** or other API consumers can be 
used to _visualize_ the collected data.

#### 2.3. Concept

**1. Data model**

**Prometheus** collects and stores its _metrics_ as _time series data_, i.e. metrics information is 
stored with the timestamp at which it was recorded, alongside optional **key-value** pairs called labels.
Here is format of a time series data as a metrics:

```text
<metric name>{<label name>=<label value>, ...}
```

For example, a time series with the metric name `api_http_requests_total` and the labels 
`method="POST"` and `handler="/messages"` could be written like this:

```text
api_http_requests_total{method="POST", handler="/messages"}
```

**2. Metric types**

Prometheus offers **four** core metric types:

- **Counter**: _cumulative_ metric that represents a single **monotonically increasing counter** whose value 
can only _increase_ or be _reset to zero_ on restart. In practice, **counter** metrics often ends with
`_total`.
  
  ```shell
  # HELP go_memstats_frees_total Total number of frees.
  # TYPE go_memstats_frees_total counter
  go_memstats_frees_total 2.8502025e+07
  ```

- **Gauge**: represents a single **numerical value** that can arbitrarily _go up_ and _down_.

    ```shell
    # HELP go_memstats_heap_objects Number of allocated objects.
    # TYPE go_memstats_heap_objects gauge
    go_memstats_heap_objects 17782
    ```
  
- **Histogram**: samples observations and counts them in _configurable buckets_. It also provides a sum of all observed values.
  
  - cumulative counters for the buckets: `<basename>_bucket{le="<upper inclusive bound>"}`
  - the total sum of all values: `<basename>_sum`
  - the count of events: `<basename>_count` 
  
    ```shell
    # HELP http_request_duration_seconds request duration histogram
    # TYPE http_request_duration_seconds histogram
    http_request_duration_seconds_bucket{le="0.5"} 0
    http_request_duration_seconds_bucket{le="1"} 1
    http_request_duration_seconds_bucket{le="2"} 2
    http_request_duration_seconds_bucket{le="3"} 3
    http_request_duration_seconds_bucket{le="10"} 3
    http_request_duration_seconds_bucket{le="+Inf"} 3
    http_request_duration_seconds_sum 6
    http_request_duration_seconds_count 3
    ```
    
  We have 3 request with duration: 1s, 2s, 3s. 
    - `http_request_duration_seconds_sum` = 1 + 2 + 3 = 6 seconds.
    - `http_request_duration_seconds_count` = 3 (total requests).
    - `http_request_duration_seconds_bucket{le="1"}` = 1 because `event value` = `bucket value` = 1.


- **Summary**: similar to a histogram, **summary** metric shows the **total count** of observations and the **sum** of 
- observed values after sampling observations. It also calculates adjustable quantiles over _a sliding time window_.

   ```shell
    # HELP go_gc_duration_seconds A summary of the GC invocation durations.
    # TYPE go_gc_duration_seconds summary
    http_request_duration_seconds{quantile="0.5"} 2
    http_request_duration_seconds{quantile="0.9"} 3
    http_request_duration_seconds{quantile="0.99"} 3
    http_request_duration_seconds_sum 6
    http_request_duration_seconds_count 3
    ```
  
**Note:** the big difference between **summaries** and **histograms** comes down to _when_ and _where_ the statistical 
quantiles are calculated. Summaries calculate quantiles _client side_, whereas histogram quantiles can be calculated 
_server side_ using a `PromQL` expression. There are trade-offs to both approaches, so pick the statistical metric type 
that makes sense for your application.


**3. Jobs and instances**

**Jobs** and **instances** are important concepts in Prometheus:

- `instance` is an endpoint you can **scrape**, usually corresponding to a single process.
- `job` is a collection of instances with the same purpose, a process replicated for scalability or reliability for example.

For example, an API server job with four replicated instances:

- job: `api-server`
  - instance 1: `1.2.3.4:5670`
  - instance 2: `1.2.3.4:5671`
  - instance 3: `5.6.7.8:5670`
  - instance 4: `5.6.7.8:5671`

Prometheus will **automatically generate** labels and time series. When it scrapes a target, it 
attaches some labels automatically to the scraped time series which serve to identify the scraped 
target:

- `job`: The configured job name that the target belongs to.
- `instance`:  The` <host>:<port>` part of the target's URL that was scraped.

#### 2.4. Prometheus in practice

**When does Prometheus fit:**

- To record purely numeric time series;
- For machine-centric monitoring;
- For monitoring of highly dynamic service-oriented architectures;
- For multi-dimensional data collection and querying.

→ Prometheus server is standalone and designed for **reliability**.

**When does Prometheus not fit:**

- For 100% accuracy, such as for per-request billing (The collected data is not detailed and 
completed enough).
- For `event logs`, `individual events` or `high cardinality` date like email and password
(because **Prometheus** uses time series database).

### 3. Alertmanager
<a name='alertmanager'></a>

#### 3.1. Overview

One of the important feature of **Prometheus** is _collecting_, _evaluating_ the metrics based on the 
defined rules, and then _notifying_ when some metrics meet the specific values (e.g. RAM used
is more than 90%, too many requests in a short time, etc.).

In order to do it, **Prometheus** needs to combine with **Alertmanager** to send `alerts` to use through
mail, Slack, Telegram, webhooks, etc.

#### 3.2. Architecture

<div align="center">
  <img width="1000" src="assets/alertmanager-architecture.svg" alt="Alertmanager architecture">
</div>

<div align="center">
  <i>Alertmanager architecture.</i>
</div>

#### 3.3. Workflow

Alerting rules in Prometheus servers send alerts to an **Alertmanager**. The **Alertmanager** then manages those alerts,
including _silencing_, _inhibition_, _aggregation_ and _sending_ out notifications via methods such as email, on-call 
notification systems, and chat platforms.

1. After collecting `metrics` from `targets` (by _pull mechanism_), Prometheus stores these metrics
in **key - value datatype** in the database.

2. For every `for` duration (by default is `1m`), Prometheus will evaluate and compare the metrics with
collected rules. 

3. When the metrics reach a specify value we defined, Prometheus will send the `alerts` to
Alertmanager through _push mechanism_

4. When the `alerts` are sent to **Alertmanager**, it will apply **silencing** to skip the alerts,
or grouping the similar alerts to prevent too many notifications, etc.

5. Here is an example of rule named `HostOutOfMemory`. 

6. Finally, **Alertmanager** will send these processed notifications to the end user through mail,
Slack, Telegram, etc.

Here is an example of **Alertmanager** rule named `HostOutOfMemory`. This alert will be triggered
when the node memory is filling up (ie. **node memery has less than 10% left**). Prometheus will compare
the metrics for every 2 minutes (`for: 2m`). Whenever, node memery has less than 10% left, Promethus
will send to **Alertmanager** an alert with `severity` label (`warning`) and other usefully information
by `summary` and `description`.

```text
 - alert: HostOutOfMemory
    expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 10
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: Host out of memory (instance {{ $labels.instance }})
      description: "Node memory is filling up (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
 ```

#### 3.4. Features 

**1. Grouping**

**Grouping** categorizes alerts of _similar nature_ into a single notification. This is 
especially useful during larger outages when many systems fail at once and hundreds to 
thousands of alerts may be firing simultaneously.

**2. Inhibition**

**Inhibition** is a concept of suppressing notifications for certain alerts if certain other alerts are already firing.

**3. Silences**

**Silences** are a straightforward way to simply mute alerts for a given time. A silence is configured based on matchers, just like the routing tree. Incoming alerts are checked whether they match all the equality or regular expression matchers of an active silence. If they do, no notifications will be sent out for that alert.

**Silences** are configured in the web interface of the Alertmanager.

**5. Client behavior**

The Alertmanager has special requirements for behavior of its client. Those are only relevant for advanced use cases where Prometheus is not used to send alerts.

**6. High Availability**

**Alertmanager** supports configuration to create a cluster for high availability. This can be
configured using the `--cluster-*` flags.

**Notes:** It's important not to load balance traffic between **Prometheus** and its **Alertmanagers**,
but instead, point **Prometheus** to a list of all **Alertmanagers**.

### 4. Grafana
<a name='grafana'></a>

#### 4.1. Overview

**Grafana** is an **open source** solution for running _data analytics_, _pulling up metrics_ that make sense 
of the massive amount of data and to monitor our apps with the help of customizable dashboards.

**Grafana** connects with every possible data source, commonly referred to as databases such as 
**Prometheus**, Influx DB, ElasticSearch, MySQL, PostgreSQL, etc.


<div align="center">
  <img width="200" src="assets/grafana-logo.svg" alt="Grafana logo">
</div>

<div align="center">
  <i>Grafana logo.</i>
</div>

#### 4.2. Productions

In this practice, I will use Grafana Open Source for demonstrating.

Although, **Grafana** also have two other services beside **Grafana Open Source** are **Grafana Cloud** and **Grafana Enterprise**, 
but those are beyond the scope of this practice, so I just introduce them here but won't get my
hands on it.

**1. Grafana Open Source**

**Grafana open source** is open source visualization and analytics software. It allows you to query, visualize, alert on,
and explore your metrics, logs, and traces no matter where they are stored. It provides you with tools to turn your 
**time-series database** (TSDB) data into insightful graphs and visualizations.

**2. Grafana Cloud**

**Grafana Cloud** is a highly available, fast, fully managed **OpenSaaS** logging and metrics platform. 
The only difference is it Grafana Labs will host it for you and handle all the other things.

However, it **is not free** (only first 2 weeks trail are free) and your data _will be pulled_ to **Grafana Labs**.

<div align="center">
  <img width="500" src="assets/grafana-cloud.png" alt=" Grafana Cloud logo">
</div>

<div align="center">
  <i> Grafana Cloud logo.</i>
</div>


**3. Grafana Enterprise**

**Grafana Enterprise** is the commercial edition of Grafana that includes additional features not found in the open 
source version. Building on Grafana, **Grafana Enterprise** adds enterprise data sources, advanced 
authentication options, more permission controls, 24x7x365 support, and training from the core Grafana team.

<div align="center">
  <img width="500" src="assets/grafana-enterprise.png" alt=" Grafana Enterprise logo">
</div>

<div align="center">
  <i> Grafana Enterprise logo.</i>
</div>

#### 4.2. Usage

**Grafana** being an open source solution also enables us to **write plugins** from scratch for integration with several
data sources. These are some useful features of **Grafana**:


- **Time series analytics**: Study, analyse and monitor data over a period of time.

- **Tracking behaviour**: Track the user behaviour, application behaviour, frequency of errors popping up in _production_ or a 
_pre-prod_ environment, type of errors popping up & the contextual scenarios by providing relative data.

- **On-prem deployed**: our data will not be streamed to the third party organization or vendor cloud,
but it will be self deployed by us.

#### 4.3. Grafana dashboard

The dashboards pull data from the plugged-in data sources such as **Prometheus**, Influx DB, 
ElasticSearch, MySQL, PostgreSQL, etc.  These are a few of many data sources which Grafana supports by default.

The dashboards contain a gamut of visualization options such as geo maps, heat maps, 
histograms, all the variety of charts & graphs which a business typically requires 
studying data.

A dashboard also contains several individual panels on the grid. Each panel has 
different functionalities.

<div align="center">
  <img width="1500" src="assets/grafana-dashboard.png" alt="Grafana dashboard">
</div>

<div align="center">
  <i>My Grafana dashboard for Node Exporter from Practice 2.</i>
</div>

## III. Prerequisites hardware
<a name='hardware'></a>

### 1. Overview
<a name='hardware-overview'></a>

In this practice, I will use 4 machines to monitoring a website from my previous practice 3.
In practice 3, I built a 3-tier web application using **Nginx**, **Flask** and **MongoDB**.

I will use **Docker** and **Ansible** for configuration, but I will not go deeper in them because
this is not the topic of this practice.

### 2. Monitor machine
<a name='monitor-machine'></a>

I will not directly install **Prometheus**, **Alertmanager** and **Grafana** here, but instead, I will 
use **Docker** and **docker-compose** to execute them. The reason is that it is easier to
remove, stop or remove containers than use install it to our OS.

For that reason, I just use **Ansible** to install **Docker** to our host machine, and then config
`Dockerfile` and `docker-compose.yml` later.

### 3. Node machines
<a name='node-machines'></a>

I will create 3 EC2 instances in Amazon Web Server for node machines:

- A node machine for hosting **Flask** server:
  - Flask server: http://34.230.19.242:5000
  - Metrics for `node_exporter`: http://34.230.19.242:9100/metrics

- A node machine for hosting **MongoDB** server and exposing the metrics by **mongodb_exporter**:
  - MongoDB server: http://54.90.221.86:27017
  - Metrics for `node_exporter`: http://54.90.221.86:9100/metrics
  - Metrics for `mongodb_exporter`: http://54.90.221.86:9216/metrics

- A node machine for hosting **Nginx** server and exposing the metrics by **nginx_exporter**.
  - Nginx server: http://18.212.78.52:8080
  - Nginx server status: http://18.212.78.52:8080/stub_status/
  - Metrics for `node_exporter`: http://18.212.78.52:9100/metrics
  - Metrics for `nginx_exporter`: http://18.212.78.52:9113/metrics

I will use **Ansible** to install all the servers and exporters directly to the virtual machines.
Because I have changed the IP and port destination, so I modified the source code a little
for adapting to our new practice.

You can visit my website UI [here](#http://18.212.78.52:8080/).

### 4. Deploy diagram

<div align="center">
  <img width="1500" src="assets/diagram.png" alt="Diagram">
</div>

<div align="center">
  <i>My deployment's diagram.</i>
</div>

## IV. Configurations
<a name='configurations'></a>

### 1. Using Ansbile to configurate monitor and node machines
<a name='setup-ansible'></a>

Connect to the hosts (include `localhost` for our machines and 3 other EC2 instance). Here is
the `hosts` inventory content:

```ini
[monitor]
localhost ansible_connection=local

[nodes]
ec2-34-230-19-242.compute-1.amazonaws.com ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./flask.pem
ec2-18-212-78-52.compute-1.amazonaws.com ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./nginx.pem
ec2-54-90-221-86.compute-1.amazonaws.com ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./mongodb.pem
```

Ansible playbook `playbook.yml`:

```yaml
- name: Install docker
  hosts: monitor
  become: yes
  roles:
  - docker

- name: Install Node Exporter
  hosts: nodes
  become: yes
  roles:
  - node_exporter

- name: Install and start Flask
  hosts: ec2-34-230-19-242.compute-1.amazonaws.com
  become: yes
  roles:
  - flask

- name: Install and start Nginx, Nginx Exporter
  hosts: ec2-18-212-78-52.compute-1.amazonaws.com 
  become: yes
  roles:
  - nginx
  - nginx_exporter
  
- name: Install and start MongoDB, MongoDB Exporter
  hosts: ec2-54-90-221-86.compute-1.amazonaws.com
  become: yes
  roles:
  - mongodb
  - mongodb_exporter
```

### 2. Prometheus configuration
<a name='setup-prometheus'></a>

Prometheus's configuration in `prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval:     30s # How frequently to scrape targets from all job
  evaluation_interval: 30s # How frequently to evaluate rules
  external_labels:
      monitor: 'practice-4'

rule_files: # Our rules files (in the same directory with prometheus)
  - 'prometheus.rules'
  - 'node.rules'
  - 'mongodb.rules'
  - 'nginx.rules'

alerting: # We will configure and use alertmanagers for alerting here.
  alertmanagers:
  - scheme: http
    static_configs:
    - targets:
      - "alertmanager:9093"

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 15s     # We will not use the global scrape_interval, but instead, set it to 15s

  - job_name: 'alertmanager'
    static_configs:
      - targets:
        - "alertmanager:9093"
  
  - job_name: 'node'
    static_configs:
      - targets:
        - "node-exporter:9100"
        - "34.230.19.242:9100"
        - "54.90.221.86:9100"
        - "18.212.78.52:9100"

  - job_name: 'mongodb'
    static_configs:
      - targets:
        - "54.90.221.86:9216"

  - job_name: 'nginx'
    static_configs:
      - targets:
        - "18.212.78.52:9113"
```

### 3. Set alert rules
<a name='setup-alert-rules'></a>

Before going in, I will explain about my severity system. For each alert, it will have a severity
label **minor**, **major** or **critical**, with the increasing of severity.

Alert rules for Prometheus `prometheus.rules`: 
 - **PrometheusTargetMissing**: 
   - A `minor` level alert, when one of the Prometheus's target is missing. 
   - It will immediately fire alert whenever one instance is down (`for: 0m`).
   - The `summary` will give you the instance that is down.
   - I set it as `minor` alert because later it could be up again.
 - **PrometheusAllTargetsMissing**: 
   - A `critical` level alert, when **all** of the Prometheus's target is missing. 
   - In this case, I set set it as a `critical` because it usually means that you have a problem with your Prometheus
or the connection problem, and you will not track or receive any metrics from other targets.
 - **PrometheusAlertmanagerJobMissing**: 
   - A `major` level alert, when Alertmanager is not up.
   - Simmilar to **PrometheusTargetMissing**, it will immediately fire alert.
 - **PrometheusNotConnectedToAlertmanager**: 
   - A `critical` level alert, when one of the Prometheus's target is missing.
   - The difference between **PrometheusAlertmanagerJobMissing** and **PrometheusNotConnectedToAlertmanager** 
 is that, when `up({job="alertmanager"})`, it maybe the job is absent only at the moment. Later,
 it could work again. But when it is not connected, it means that Prometheus even could not connect 
 Alertmanager.


```yaml
  groups:
  - name: targets
    - alert: PrometheusTargetMissing
      expr: up == 0
      for: 0m
      labels:
        severity: major
      annotations:
        summary: Prometheus target missing (instance {{ $labels.instance }})
        description: "A Prometheus target has disappeared. An exporter might be crashed.\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
        
    - alert: PrometheusAllTargetsMissing
      expr: sum by (job) (up) == 0
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus all targets missing (instance {{ $labels.instance }})
        description: "A Prometheus job does not have living target anymore.\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
        
  - name: alertmanager
    - alert: PrometheusAlertmanagerJobMissing
      expr: absent(up{job="alertmanager"})
      for: 0m
      labels:
        severity: major
      annotations:
        summary: Prometheus AlertManager job missing (instance {{ $labels.instance }})
        description: "A Prometheus AlertManager job has disappeared\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
        
    - alert: PrometheusNotConnectedToAlertmanager
      expr: prometheus_notifications_alertmanagers_discovered < 1
      for: 0m
      labels:
        severity: critical
      annotations:
        summary: Prometheus not connected to alertmanager (instance {{ $labels.instance }})
        description: "Prometheus cannot connect the Alertmanager\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

Alert rules for Node exporter `node.rules`: In here I set 2 groups, one for **memory** and the other for **CPU**.

- **HostOutOfMemory<severity>**: Calculate by the percent of available memory `node_memory_MemAvailable_bytes`
over total memory `node_memory_MemTotal_bytes`.
  - **HostOutOfMemoryMinor**: When memory left is less than **20%**.
  - **HostOutOfMemoryMajor**: When memory left is less than **15%**.
  - **HostOutOfMemoryCritical**: When memory left is less than **10%**.
- **HostHighCpuLoad<severity>** - calculate by the **idle** CPU in _2 minutes_ and trigger when it
keeps high for _5 minutes_.
  - **HostHighCpuLoadMinor**: When CPU load is higher than **80%**.
  - **HostHighCpuLoadMajor**: When CPU load is higher than **85%**.
  - **HostHighCpuLoadMajor**: When CPU load is higher than **90%**.

You can see here, for **memory**, I set `for: 2m`, however for **CPU** I set it as `for: 5m`.
The reason is that when the machine need to do some high level action, it could use a lot of resource
to do, but later when it is done, the CPU will work as usual. For example, it when it is in the build stage,
we will need a lot of resource, however, later when the build process is finished, it will be back to 
normal.

```yaml
groups:
- name: memory
  rules:
  - alert: HostOutOfMemoryMinor
    expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 20 and node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 >= 15
    for: 2m
    labels:
      severity: minor
    annotations:
      summary: Host out of memory (instance {{ $labels.instance }})
      description: "Node memory is filling up (< 20% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: HostOutOfMemoryMajor
    expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 15 and node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 >= 10
    for: 2m
    labels:
      severity: major
    annotations:
      summary: Host out of memory (instance {{ $labels.instance }})
      description: "Node memory is filling up (< 15% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: HostOutOfMemoryCritical
    expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 10
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: Host out of memory (instance {{ $labels.instance }})
      description: "Node memory is filling up (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
- name: cpu
  rules:
  - alert: HostHighCpuLoadMinor
    expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) >= 80 and 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) < 90
    for: 0m
    labels:
      severity: minor
    annotations:
      summary: Host high CPU load (instance {{ $labels.instance }})
      description: "CPU load is > 80%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: HostHighCpuLoadMajor
    expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) >= 90 and 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) < 95
    for: 0m
    labels:
      severity: major
    annotations:
      summary: Host high CPU load (instance {{ $labels.instance }})
      description: "CPU load is > 85%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: HostHighCpuLoadCritical
    expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) >= 95
    for: 0m
    labels:
      severity: critical
    annotations:
      summary: Host high CPU load (instance {{ $labels.instance }})
      description: "CPU load is > 90%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

Alert rules for MongoDB exporter `mongodb.rules`:
- **MongodbDown**: When our database server is down.
- **MongodbTooManyConnections**: When the average number of connections to MongoDB server in 1 minute 
is more than 80%.
- **MongodbVirtualMemoryUsage**: When the virtual memory usage is more than 3 times bigger than the 
mapped memory .

```yaml
groups:
- name: mongodb
  - alert: MongodbDown
    expr: mongodb_up == 0
    for: 0m
    labels:
      severity: critical
    annotations:
      summary: MongoDB Down (instance {{ $labels.instance }})
      description: "MongoDB instance is down\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: MongodbTooManyConnections
    expr: avg by(instance) (rate(mongodb_connections{state="current"}[1m])) / avg by(instance) (sum (mongodb_connections) by (instance)) * 100 > 80
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: MongoDB too many connections (instance {{ $labels.instance }})
      description: "Too many connections (> 80%)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      
  - alert: MongodbVirtualMemoryUsage
    expr: (sum(mongodb_memory{type="virtual"}) BY (instance) / sum(mongodb_memory{type="mapped"}) BY (instance)) > 3
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: MongoDB virtual memory usage (instance {{ $labels.instance }})
      description: "High memory usage\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

Alert rules for Nginx exporter `nginx.rules`:

- **NginxHighHttp4xxErrorRate**: When the number of `4xx` status request over total request more than 5%.
- **NginxHighHttp5xxErrorRate**: When the number of `5xx` status request over total request more than 5%.


```yaml
groups:
- name: nginx
  - alert: NginxHighHttp4xxErrorRate
    expr: sum(rate(nginx_http_requests_total{status=~"^4.."}[1m])) / sum(rate(nginx_http_requests_total[1m])) * 100 > 5
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: Nginx high HTTP 4xx error rate (instance {{ $labels.instance }})
      description: "Too many HTTP requests with status 4xx (> 5%)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
  - alert: NginxHighHttp5xxErrorRate
    expr: sum(rate(nginx_http_requests_total{status=~"^5.."}[1m])) / sum(rate(nginx_http_requests_total[1m])) * 100 > 5
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: Nginx high HTTP 5xx error rate (instance {{ $labels.instance }})
      description: "Too many HTTP requests with status 5xx (> 5%)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

### 4. Alertmanager configuration
<a name='setup-alertmanager'></a>

Although **Alertmanager** supports _email_, but I prefer using **Telegram** because it is lighter and used mostly in
our intern program. In this practice, I will use **Telepush** bot to set up and receive our alerts,
follow these steps:

1. Get a token from Telepush by start a new chat with [TelepushBot](https://t.me/MiddlemanBot).
<div align="center"> 
  <img width="500" src="assets/telepushbot.png" alt="Telepush Bot">
</div>
<div align="center">
  <i>Get token from TelepushBot.</i>
</div>

2. Configure Alertmanager in `alertmanager/config.yml` (we will use them in Docker later).

```yaml
global:

# set route to receive and handle all incoming alerts
route:
  group_by: ['alertname']
  group_wait: 10s       # wait up to 10s for more alerts to group them
  receiver: 'telepush'  # set the receiver below

receivers:
- name: 'telepush'
  webhook_configs:
  - url: 'https://telepush.dev/api/inlets/alertmanager/<TELEPUSH_TOKEN>'    # our TelepushBot token
    http_config:
```

3. Generate alert for testing. I will turn off Wi-Fi to disable the connection between Prometheus 
and other targets. The results I will show in the [Deployment](#deployment) section.

### 5. Using Docker to deploy Prometheus, Grafana and Alertmanager
<a name='setup-docker'></a>

Here is my `docker-compose.yml`.

```yaml
version: '3.1'

volumes:
    prometheus_data: {}
    grafana_data: {}

services:

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus/:/etc/prometheus/
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - 9090:9090
    links:
      - alertmanager:alertmanager
    restart: always
    deploy:
      mode: global

  node-exporter:
    image: prom/node-exporter
    ports:
      - 9100:9100
    restart: always
    deploy:
      mode: global

  alertmanager:
    image: prom/alertmanager
    ports:
      - 9093:9093
    volumes:
      - ./alertmanager/:/etc/alertmanager/
    restart: always
    command:
      - '--config.file=/etc/alertmanager/config.yml'
      - '--storage.path=/alertmanager'
    deploy:
      mode: global

  grafana:
    image: grafana/grafana
    depends_on:
      - prometheus
    ports:
      - 3000:3000
    volumes:
      - grafana_data:/var/lib/grafana
    env_file:
      - ./grafana/config.monitoring
      
```

## V. Deployment
<a name='deployment'></a>

### 1. Run `ansible-playbook` to setting up our minitor and node machines
<a name='deployment-ansible'></a>

1. Use `ansible-playbook` to set up all the monitor and node machines

    <div align="center"> 
      <img width="1500" src="assets/ansible-playbook.png" alt="Run ansible-playbook">
    </div>
    <div align="center">
      <i>Run ansible-playbook to deploy our machines.</i>
    </div>
   
2. Test our deployment product

    <div align="center"> 
      <img width="1500" src="assets/product.png" alt="Final product">
    </div>
    <div align="center">
      <i>Final product is hosted at http://18.212.78.52:8080.</i>
    </div>


3. Try to get `alertmanager` metrics

    <div align="center"> 
      <img width="1500" src="assets/alertmanager-metrics.png" alt="Alertmanager metrics">
    </div>
    <div align="center">
      <i>Alertmanager metrics can be got at http://localhost:9093/metrics.</i>
    </div>

4. Try to get `node-exporter` metrics

    <div align="center"> 
      <img width="1500" src="assets/node-exporter.png" alt="Node Exporter">
    </div>
    <div align="center">
      <i>Node Exporter metrics can be got at http://34.230.19.242:9100/metrics.</i>
    </div>
   

5. Try to get `mongodb-exporter` metrics

    <div align="center"> 
      <img width="1500" src="assets/mongodb-exporter.png" alt="MongoDB Exporter">
    </div>
    <div align="center">
      <i>MongoDB Exporter metrics can be got at http://54.90.221.86:9216/metrics.</i>
    </div>
   

6. Try to get `nginx-exporter` metrics

    <div align="center"> 
      <img width="1500" src="assets/nginx-exporter.png" alt="Nginx Exporter">
    </div>
    <div align="center">
      <i>Nginx Exporter metrics can be got at http://18.212.78.52:9113/metrics.</i>
    </div>

### 2. Run `docker compose` to start our Prometheus, Alertmanager and Grafana 
<a name='deployment-docker'></a>

1. Use `docker compose` to run our **Prometheus**, **Alertmanager** and **Grafana**.

    <div align="center"> 
      <img width="1500" src="assets/docker-compose.png" alt="Docker compose">
    </div>
    <div align="center">
      <i>Start our Prometheus, Alertmanager and Grafana servers.</i>
    </div>
   
2. Check our **Prometheus**'s targets.

    <div align="center"> 
      <img width="1500" src="assets/prometheus-targets.png" alt="Prometheus targets">
    </div>
    <div align="center">
      <i>All the targets is up.</i>
    </div>

3. Check our **Prometheus**'s alerts.

    <div align="center"> 
      <img width="1500" src="assets/prometheus-alerts.png" alt="Prometheus query">
    </div>
    <div align="center">
      <i>All alerts are current inactive.</i>
    </div>
   
4. Try to execute a query in **Prometheus**.
    <div align="center"> 
      <img width="1500" src="assets/prometheus-query.png" alt="Prometheus query">
    </div>
    <div align="center">
      <i>Try query in Prometheus to file the rate of idle CPU in 2 minutes.</i>
    </div>

5. Checkout **Alertmanager**
    <div align="center"> 
      <img width="1500" src="assets/alertmanager.png" alt="Alertmanager">
    </div>
    <div align="center">
      <i>Current there is not any alert.</i>
    </div>

6. Try **Grafana**

    After assign a data source (**Prometheus**), we will create a new dashboard,
and then add rows and panels in this dashboard.

    <div align="center"> 
      <img width="1500" src="assets/cpu-panel.png" alt="CPU load panel">
    </div>
    <div align="center">
      <i>Add a panel for CPU load.</i>
    </div>
   
    <div align="center"> 
      <img width="1500" src="assets/ram-usage.png" alt="RAM usage panel">
    </div>
    <div align="center">
      <i>Add a panel for RAM usage.</i>
    </div>
   
    Now, I will add a **variable** to Grafana. Using variable is the good way to save
our time, our dashboard' area and easy to manipulate the dashboard.

    <div align="center"> 
      <img width="1500" src="assets/add-variable.png" alt="Add a variable">
    </div>
    <div align="center">
      <i>Try to add a variable node - all instance of Node Exporter.</i>
    </div>
    
    Apply similar for the new panel of Network traffic. Our result after this step
    
    <div align="center"> 
      <img width="1500" src="assets/network-traffic.png" alt="Network traffic">
    </div>
    <div align="center">
      <i>Using variable for Network traffic dashboard.</i>
    </div>

    Continue, using **row** to group similar panels together. Finnaly, I have 3 groups:
Prometheus, MongoDB Exporter and Node Exporter.

    <div align="center"> 
      <img width="1500" src="assets/final-grafana.png" alt="Final Grafana">
    </div>
    <div align="center">
      <i>Our final Grafana result.</i>
    </div>

    I have saved this dashboard as `json` for later use we use Docker to run Grafana.

### 3. Generate alerts
<a name='deployment-generate'></a>

I turn off the Wi-Fi connection to make Prometheus could not scrape metrics from targets of
other machines.

<div align="center"> 
  <img width="1500" src="assets/prometheus-turn-off-wifi.png" alt="Prometheus">
</div>
<div align="center">
  <i>Prometheus's targets.</i>
</div>

<div align="center"> 
  <img width="1500" src="assets/alertmanager-test.png" alt="Alertmanager">
</div>
<div align="center">
  <i>Alerts showed in Alertmanager.</i>
</div>


<div align="center"> 
  <img width="500" src="assets/telepush-test.png" alt="Telepush Bot test">
</div>
<div align="center">
  <i>Alerts are sent to Telegram through TelepushBot.</i>
</div>

Later, after finish the Practice 4, I finally receive a _real_ alert.

<div align="center"> 
  <img width="500" src="assets/telepush-real.png" alt="Telepush Bot real">
</div>
<div align="center">
  <i>"Real" alert to TelepushBot about CPU.</i>
</div>


## VI. Additional: High Availability Alertmanager
<a name='additional'></a>

Although, Alertmanager is a great tool for handling Prometheus alerts. However, a lone 
instance of Alertmanager can serve as a single point of failure if it goes down. 
That's why we can configure Alertmanager to run in a multi-instance cluster to provide 
failure resilience.

In this section, I will make an existing single-instance Alertmanager setup 
highly available by adding another instances.

### 1. Set up a new EC2 instance
<a name='set-up-ha'></a>

I will create a new EC2 instance and setup it with Ansible. They are similar to the configuration
above, the only difference is that now the Prometheus will have 2 targets for alerting and
we will include the option `--cluster.peer` for each Alertmanager instance:

```yaml
...

alerting: # We will configure and use alertmanagers for alerting here.
  alertmanagers:
  - scheme: http
    static_configs:
    - targets:
      - "35.173.247.2:9093"
      - "34.227.159.188:9093"
      
...
```

```yaml
...

    command:
    - '--config.file=/tmp/config.yml'
    - '--storage.path=/alertmanager'
    - '--cluster-peer=34.227.159.188:9093'
    
...
```

### 2. Test our High availability Alertmanager
<a name='test-ha'></a>

- Check the Alertmanager at http://35.173.247.2:9093.

<div align="center"> 
  <img width="1500" src="assets/HA-1.png" alt="HA Alertmanager 1">
</div>
<div align="center">
  <i>Alertmanager in http://35.173.247.2:9093 show 2 alerts.</i>
</div>

- We can see these alerts also display in http://34.227.159.188:9093.

<div align="center"> 
  <img width="1500" src="assets/HA-2.png" alt="HA Alertmanager 2">
</div>
<div align="center">
  <i>Alertmanager in http://34.227.159.188:9093 show 2 identical alerts.</i>
</div>

- When we try to silent a alerts, this alerts will also be silenced in the other Alertmanager.

## VII. References
<a name='references'></a>

[1] [An Introduction to Metrics, Monitoring, and Alerting](https://www.digitalocean.com/community/tutorials/an-introduction-to-metrics-monitoring-and-alerting)

[2] [Prometheus documentations](https://prometheus.io/)

[3] [Prometheus Monitoring : The Definitive Guide in 2019](https://devconnected.com/the-definitive-guide-to-prometheus-in-2019)

[4] [An Introduction to Prometheus Monitoring (2021)](https://sensu.io/blog/introduction-to-prometheus-monitoring#:~:text=Prometheus%20is%20a%20monitoring%20solution,%22scraping%22%20metrics%20HTTP%20endpoints.)

[5] [Grafana website](https://grafana.com/)

[6] [Node Exporter role for Ansible](https://github.com/cloudalchemy/ansible-node-exporter)

[7] [MongoDB role for Ansible](https://github.com/UnderGreen/ansible-role-mongodb)

[8] [MongoDB Exporter role Ansible](https://galaxy.ansible.com/kostiantyn-nemchenko/mongodb_exporter)
