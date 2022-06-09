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

[III. Configurations](#configurations)

[IV. References](#references)

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

#### 1.1. Overview

**Prometheus** is an **open-source** systems _monitoring_ and _alerting_ toolkit originally built at 
SoundCloud in 2012. The project is written in **Go** and licensed under the **Apache 2 License**, with source code available on 
[GitHub](https://github.com/prometheus/prometheus).

**Prometheus** has a very active developer and user community. It is now a standalone open source project 
and maintained independently of any company. In 2016, **Prometheus** joined the Cloud Native Computing 
Foundation as the second hosted project, after Kubernetes.

<div align="center">
  <img width="500" src="assets/prometheus-logo.png" alt="Prometheus logo">
</div>

<div align="center">
  <i>Prometheus logo.</i>
</div>

#### 1.2. Architecture

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
- **Dashboard** (`optional`): we usually use **Grafana** for Dashboard, in order to display and visualize metrics value in the 
chart type's format.
- **Push gateway** (`optional`): for supporting short-lived jobs.

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

#### 1.3. Concept

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


- **Summary**: similar to a histogram, it provides a **total count** of observations and a **sum of all** observed values and
**calculates** configurable quantiles over a sliding time window.

   ```shell
    # HELP go_gc_duration_seconds A summary of the GC invocation durations.
    # TYPE go_gc_duration_seconds summary
    http_request_duration_seconds{quantile="0.5"} 2
    http_request_duration_seconds{quantile="0.9"} 3
    http_request_duration_seconds{quantile="0.99"} 3
    http_request_duration_seconds_sum 6
    http_request_duration_seconds_count 3
    ```
  
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

#### 1.4. Prometheus in practice

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

### 4. Grafana
<a name='grafana'></a>

#### 4.1. Overview

**Grafana** is an **open source** solution for running _data analytics_, _pulling up metrics_ that make sense 
of the massive amount of data and to monitor our apps with the help of customizable dashboards.

**Grafana** connects with every possible data source, commonly referred to as databases such as 
**Prometheus**, Influx DB, ElasticSearch, MySQL, PostgreSQL, etc.


<div align="center">
  <img width="500" src="assets/grafana-logo.svg" alt="Grafana logo">
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


## III. Configurations
<a name='configurations'></a>

### 1. Using Docker to use Prometheus, Alertmanager and Grafana in host machine

### 2. Using Ansible for configurate


## IV. References
<a name='references'></a>

[1] [An Introduction to Metrics, Monitoring, and Alerting](https://www.digitalocean.com/community/tutorials/an-introduction-to-metrics-monitoring-and-alerting)

[2] [Prometheus website](https://prometheus.io/)

[3] [Grafana website](https://grafana.com/)