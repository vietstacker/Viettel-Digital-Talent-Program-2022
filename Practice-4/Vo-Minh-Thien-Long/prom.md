# Tổng quan về Prometheus

Author: @longcv3

Mục lục
=================

  * [1. Giới thiệu cơ bản về Prometheus](#1-giới-thiệu-cơ-bản-về-prometheus)
      * [Monitoring là gì? Khác gì với Logging và Tracing](#monitoring-là-gì-khác-gì-với-logging-và-tracing)
      * [Prometheus là gì?](#prometheus-là-gì)
      * [Các khái niệm cơ bản của Prometheus](#các-khái-niệm-cơ-bản-của-prometheus)
        * [Data model](#data-model)
        * [Metric types](#metric-types)
        * [Jobs and instances](#jobs-and-instances)
      * [Kiến trúc của Prometheus stack và các thành phần cơ bản](#kiến-trúc-của-prometheus-stack-và-các-thành-phần-cơ-bản)
      * [Trường hợp nào sử dụng Prometheus? Trường hợp nào không nên sử dụng](#trường-hợp-nào-sử-dụng-prometheus-trường-hợp-nào-không-nên-sử-dụng)
  * [2. Cấu hình Prometheus](#2-cấu-hình-prometheus)
      * [Cấu hình Prometheus server](#cấu-hình-prometheus-server)
      * [Recording rules](#recording-rules)
      * [Alerting rules](#alerting-rules)
      * [Templating](#templating)
  * [3. Tìm hiểu về Prometheus Alertmanager](#3-tìm-hiểu-về-prometheus-alertmanager)
      * [Cách thức hoạt động](#cách-thức-hoạt-động)
      * [Cấu hình cơ bản của Prometheus Alertmanager](#cấu-hình-cơ-bản-của-prometheus-alertmanager)
        * [Cấu hình webhook - Format của Alert gửi từ webhook](#cấu-hình-webhook---format-của-alert-gửi-từ-webhook)
        * [Cấu hình Email](#cấu-hình-email)
      * [Alertmanager High Availability](#alertmanager-high-availability)
      * [Cách group alert, match alert và inhibit rules](#cách-group-alert-match-alert-và-inhibit-rules)


## 1. Giới thiệu cơ bản về Prometheus
### Monitoring là gì? Khác gì với Logging và Tracing
- Monitoring là việc thu thập dữ liệu dạng metric từ một target nào đó như server, container ... nhằm mục đích hiểu hệ thống hơn và đưa ra cảnh báo kịp thời khi hệ thống gặp vấn đề.
- Logging là việc ghi lại thông tin về hoạt động của hệ thống hoặc các dịch vụ dưới dạng plaintext, structured hay binary. Khi hệ thống, dịch vụ gặp sự cố chúng ta có thể phân tích log để tìm ra nguyên nhân, từ đó khắc phục sự cố nhanh hơn.
- Tracing thể hiện quá trình một user đi qua cả stack của ứng dụng. Mục đích của Tracing là tối ưu hóa. (ví dụ: trong quá trình tracing chúng ta phát hiện ra các bottlenecks nằm trong stack ứng dụng)
### Prometheus là gì?
- Prometheus là một bộ công cụ giám sát và cảnh báo mã nguồn mở ban đầu được xây dựng bởi công ty SoundCloud. Kể từ khi thành lập vào năm 2012, nhiều công ty và tổ chức đã áp dụng Prometheus vào hệ thống và dự án này có một cộng đồng người dùng và nhà phát triển rất tích cực.
- Prometheus bây giờ đã trở thành một dự án mã nguồn mở độc lập và được duy trì độc lập với bất kỳ công ty nào. Prometheus đã tham gia vào tổ chức Cloud Native Computing Foundation vào năm 2016 với tư cách là dự án được ưu tiên phát triển lớn thứ hai, sau Kubernetes (k8s).
### Các khái niệm cơ bản của Prometheus
#### Data model
Prometheus lưu trữ dữ liệu dạng time-series. Mối time-series được định nghĩa bởi một metric-name và một tập các cặp key-value (hay cặp các labels).
Format của một time-serie:
```
<metric name>{<label name>=<label value>, ...}
```
Ví dụ, một time-series với metric-name api_http_requests_total và các label method="POST", handler="/messages" sẽ giống như sau:
```
api_http_requests_total{method="POST", handler="/messages"}
```
#### Metric types
Prometheus cung cấp 4 kiểu metric cơ bản:
- Counter thể hiện một giá trị số chỉ tăng. Giá trị sẽ trở về 0 khi restart. Trong thực thế, các metric dạng này thường kết thúc với đuôi `_total`.
    ```
    # HELP go_memstats_frees_total Total number of frees.
    # TYPE go_memstats_frees_total counter
    go_memstats_frees_total 2.8502025e+07
    ```
- Gauge thể hiện một giá trị số, có thể tùy ý tăng hoặc giảm giá trị.
    ```
    # HELP go_memstats_heap_objects Number of allocated objects.
    # TYPE go_memstats_heap_objects gauge
    go_memstats_heap_objects 17782
    ```
- Histogram, có thể hình dung đây như một biểu đồ tích lũy. Histogram được chia thành nhiều bucket, bucket đếm số lần mà `event value` nhỏ hơn hoặc bằng `bucket value` hay chính là `le`. Ngoài ra, histogram còn có các giá trị: `<basename>_sum` tính tổng tất cả các `event value`, `<basename>_count` đếm số lượng `event` đã quan sát.
    ```
    # HELP http_request_duration_seconds request duration histogram
    # TYPE http_request_duration_seconds histogram
    http_request_duration_seconds_bucket{le="0.5"} 0
    http_request_duration_seconds_bucket{le="1"} 1
    http_request_duration_seconds_bucket{le="2"} 2
    http_request_duration_seconds_bucket{le="3"} 3
    http_request_duration_seconds_bucket{le="5"} 3
    http_request_duration_seconds_bucket{le="+Inf"} 3
    http_request_duration_seconds_sum 6
    http_request_duration_seconds_count 3
    ```
    - Giả thiết: có 3 request đến với thời lượng lần lượt là: 1s, 2s, 3s.
    - `<basename>_sum` = 1s + 2s + 3s = 6s
    - `<basename>_count` = 3, là số request tối đa hay chính là số request chúng ta đang quan sát.
    - bucket {le="1"}  = 1, bởi vì `event value` = `bucket value` = 1.
- Summary dùng để theo dõi kích thước của các sự kiện, thường tính theo thời gian.(ví dụ như lượng bytes trung bình trả về trong mỗi response).
    ```
    # HELP go_gc_duration_seconds A summary of the GC invocation durations.
    # TYPE go_gc_duration_seconds summary
    http_request_duration_seconds{quantile="0.5"} 2
    http_request_duration_seconds{quantile="0.9"} 3
    http_request_duration_seconds{quantile="0.99"} 3
    http_request_duration_seconds_sum 6
    http_request_duration_seconds_count 3
    ```
#### Jobs and instances
- Một endpoint mà Prometheus server dùng để scrape được gọi là một instance, tương ứng với một single process.
- Một tập các instance với cùng một mục đích được gọi là một job.
- Ví dụ, một job với 3 instance:
  ```
  cpu_usage(job="api-server", instance="1.2.3.4:5670") 11
  cpu_usage(job="api-server", instance="1.2.3.4:5671") 12
  cpu_usage(job="api-server", instance="5.6.7.8:5670") 13
  ``` 

### Kiến trúc của Prometheus stack và các thành phần cơ bản
![](images/prom_architecture.png)

Các thành phần chính trong kiến trúc của Prometheus:
- Prometheus server
    - Service Discovery: giúp Prometheus tự động scrape những dynamic-target.
    - Rules và Alerts: chúng ta sử dụng PromQL để định nghĩa các rule, Prometheus server làm việc tính toán và đánh giá các metric dựa trên các rule đã định nghĩa. Ngoài ra, Prometheus server có trách nhiệm đẩy alert sang alertmanager.
    - Storage: lưu trữ metric mà Prometheus Server đã scrape trên một database dạng time-series.
- Exporter: là thành phần nằm trên mục tiêu muốn monitoring. Nó có trách nhiệm thu thập các metric và đẩy chúng ra một endpoint, phục vụ quá trình scrape của Prometheus Server.
- Alertmanager: xử lý các alert được gửi từ Prometheus Server tới. Nó quan tâm tới việc deduplicating, grouping và routing chúng tới đúng địa chỉ người/nhóm nhận thông báo. Các hình thức thông báo như: email, service(PagerDuty), chat(Slack). Ngoài ra, Alertmanager cũng quan tâm tới việc silence và inhibition các alert.
- Dashboard: thường dùng Grafana, đây là nơi sử dụng PromQL để hiện thị dữ liệu đã được scrape dưới dạng biểu đồ.

### Trường hợp nào sử dụng Prometheus? Trường hợp nào không nên sử dụng
- Prometheus thích hợp để giám sát máy chủ trung tâm, dịch vụ.
- Prometheus không phù hợp trong các trường hợp:
  - Giám sát các ứng dụng, dịch vụ liên quan đến tính toán tiền hoặc hóa đơn. Vì các metric trong Prometheus đã được làm tròn, dẫn tới kết quả tính toán không chính xác 100%.
  - Do Prometheus sử dụng database kiểu time-series nên nó không phù hợp để lưu trữ `event logs`, `individual events` hoặc dữ liệu kiểu `high cardinality` như email và password. 
## 2. Cấu hình Prometheus
### Cấu hình Prometheus server
```yaml
global:
  scrape_interval:     15s
  evaluation_interval: 15s

  # Attach these labels to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  external_labels:
      monitor: 'docker-host-alpha'

# Load and evaluate rules in this file every 'evaluation_interval' seconds.
rule_files:
  - "alert.rules"

# A scrape configuration containing exactly one endpoint to scrape.
scrape_configs:
  - job_name: 'nodeexporter'
    scrape_interval: 5s
    static_configs:
      - targets: ['10.x.x.x:9100']

  - job_name: 'cadvisor'
    scrape_interval: 5s
    static_configs:
      - targets: ['10.x.x.x:8080']

  - job_name: 'prometheus'
    scrape_interval: 10s
    static_configs:
      - targets: ['10.x.x.x:9090']

  - job_name: 'pushgateway'
    scrape_interval: 10s
    honor_labels: true
    static_configs:
      - targets: ['10.x.x.x:9091']


alerting:
  alertmanagers:
  - scheme: http
    static_configs:
    - targets: 
      - '10.x.x.x:9093'

```
Phía trên là một ví dụ về file config prometheus.yml với các thành phần chính:
- scrape_interval: thời gian của một chu kỳ scrape từ Prometheus Server
- evaluation_interval: thời gian của một chu kỳ load lại `rule_files`
- rule_files: chỉ ra tên và vị trí của rule file, nơi định nghĩa ra `alerting rule` và `recording rule`. Prometheus Server sẽ sử dụng trong quá trình tạo alert.
- job_name: tên của job, tên thể hiện ý nghĩa của một job
- targets: địa chỉ của target muốn monitoring
### Recording rules
- Dùng để tạo ra các metric mới dạng pre-calculate, nó là kết quả của một biểu thức PromQL. Sau đó, giá trị của metric được lưu lại tại time-series database, metric này sẽ được sử dụng ở trên `Grafana dashboard` hoặc được thực thi ở `Prometheus’s built-in expression` trên trình duyệt.
- Ví dụ:
    ```
    groups:
      - name: recording_rules
        rules:
          - record: node_exporter:node_memory_free:memory_used_percents
            expr: 100 - 100 * (node_memory_MemFree / node_memory_MemTotal)

    ```
- Trong ví dụ trên, phần `rules` gồm có `record` và `expr`. 
  - `record` là phần tên của metric mới. 
  - `expr` là biểu thức tính toán ra giá trị của metric mới (đây là biểu thức mà thông thường chúng ta sẽ dùng nhiều lần).
### Alerting rules
- Để xác định một rule, chúng ta có một biểu thức và ngưỡng dành cho nó. Nếu giá trị biểu thức mà vượt qua ngưỡng này, Prometheus server sẽ đẩy alert tới Alertmangaer để tạo notification.
- Ví dụ:
    ```
    groups:
      - name: alerting_rules
      rules:
        - alert: LoadAverage15m
          expr: node_load15 >= 0.75
          labels:
            severity: major
          annotations:
            summary: "Instance {{ $labels.instance }} - high load average"
            description: "{{ $labels.instance  }} (measured by {{ $labels.job }}) has high load average ({{ $value }}) over 15 minutes."
    ```
  - Trong ví dụ trên, `rules` gồm có `alert`, `expr`, `labels`, `annotations`.
    - `alert`: tên của alert
    - `expr` biểu thức xác định tính chất của rule
    - `labels`, ở đây thể hiện mức độ nghiêm trọng của alert
    - `annotations` là phần chú thích, bao gồm
      - `summary`: tóm tắt nội dung của alert
      - `description`: mô tả chi tiết alert
### Templating
Prometheus hỗ trợ templating, template giúp hiển thị dữ liệu theo format, chạy các câu truy vấn từ local database, sử dụng điều kiện,... Prometheus templating language được xây trên hệ thống Go Templating.
Dưới đây là ví dụ về một alert templates đơn giản:
```
alert: InstanceDown
expr: up == 0
for: 5m
labels:
  severity: page
annotations:
  summary: "Instance {{$labels.instance}} down"
  description: "{{$labels.instance}} of job {{$labels.job}} has been down for more than 5 minutes."
```

## 3. Tìm hiểu về Prometheus Alertmanager
### Cách thức hoạt động
- Alertmanager xử lý các alert được gửi từ Prometheus Server tới. Nó quan tâm tới việc deduplicating, grouping và routing chúng tới đúng địa chỉ người/nhóm nhận thông báo. Các hình thức thông báo như: email, service(PagerDuty), chat(Slack). Ngoài ra, Alertmanager cũng quan tâm tới việc silence và inhibition các alert.
- Dưới đây là workflow của Alertmanager:

![](https://raw.githubusercontent.com/prometheus/alertmanager/master/doc/arch.svg?sanitize=true)

- Note
    - Inhibition: chặn cảnh báo dạng cha-con. Ví dụ: khi một server shutdown thì hiển nhiên các container trong server cũng vậy, lúc đó chúng ta dùng inhibition để tắt cảnh báo cho server và tự động cảnh báo cho container cũng bị tắt.
    - Silences: tắt một/một số cảnh báo. Trong trường hợp muốn tắt nhiều cảnh báo, chúng ta dùng regex.
### Cấu hình cơ bản của Prometheus Alertmanager
#### Cấu hình webhook - Format của Alert gửi từ webhook
Cấu hình chat(Slack) sử dụng webhook.
```yaml
route:
    receiver: 'slack'
    group_interval: 5m
    repeat_interval: 5m

receivers:
    - name: 'slack'
      slack_configs:
          - send_resolved: true
            text: "{{ .CommonAnnotations.description }}"
            username: 'YOUR_NAME'
            channel: '#YOUR_CHANNEL'
            api_url: 'https://hooks.slack.com/services/WEB_HOOK_ID'
```
#### Cấu hình Email
Cấu hình email trong trường hợp dùng YOUR_EMAIL gửi notification tới YOUR_EMAIL.
```yaml
route:
  receiver: 'YOUR_RECEIVER'
  group_interval: 10s
  repeat_interval: 10s

receivers:
- name: 'YOUR_NAME'
  email_configs:
  - to: 'YOUR_EMAIL'
    from: 'YOUR_EMAIL'
    smarthost: 'smtp.viettel.com.vn:465' # mail server of viettel
    auth_username: 'YOUR_EMAIL'
    auth_password: 'YOUR_PASSWORD'
    auth_identity: 'YOUR_EMAIL'
```
### Alertmanager High Availability
- Trong các mô hình HA-Alertmanager thực tế, số lượng Prometheus Server và Alertmanager là tùy biến theo yêu cầu thực tế.
- Key point trong trường hợp dưới là 2 prometheus server nói chuyện với 2 alertmanager. Quá trình alerting sẽ vẫn hoạt động miễn là còn 1 prometheus server nói chuyện được với một alertmanager.
- Dưới đây là một mô hình HA-Alertmanager. Sử dụng:
  - 2 Prometheus Server
  - 2 Alertmanager

  ![](images/alertmanager_ha.png)

- Ở mô hình này, các Prometheus server không giao tiếp với nhau mà đẩy trực tiếp alert tới cả 2 Alertmanager. Để tránh duplicate các notification và silences cần phải đồng bộ giữa các Alertmanager. Chúng ta dùng `gossip` để làm việc này. 
- `Gossip` là một cách giao tiếp giữa các Alertmanager với nhau. Nó đảm bảo dữ liệu sẽ được truyền đến tất cả các `node` thành viên trọng mạng. Mỗi Alertmanager đều có database riêng, nhờ gossip các database sẽ được đồng bộ dữ liệu với nhau.
- Các Alertmanager dùng `gossip` sẽ đồng bộ 2 việc:
  - Gửi notifications: noti được gửi đi duy nhất ở Alertmanager0, các Alertmanager khác sẽ được đồng bộ dữ liệu nhưng không gửi notification.
    ![](images/gossip_alerting.png)
  - Silences có hai trường hợp
      - Tạo mới Silences: silence được tạo ra ở Alertmanager0 và sau đó sẽ được đồng bộ tới các Alertmanager khác.
        ![](images/gossip_create_silence.png)
      - Cập nhật Silences: cơ chế cũng tương tự quá trình tạo silence mới. Dữ liệu sẽ được cập nhật đầu tiên ở Alertmanager0 rồi sau đó nhờ gossip đồng bộ tới các Alertmanager khác.
### Cách group alert, match alert và inhibit rules
- Grouping: phân loại các cảnh báo theo nhóm.
    - Xem ví dụ sau:
        ```yaml
        route:
            receiver: fallback-pager
            group_by: [team]
            routes:
                # Frontend team.
                - match:
                    team: frontend
                group_by: [region, env]
                receiver: frontend-pager
        ```

    - Group Alert: đầu tiên các alert sẽ được group theo label `team`. Sau đó, đối với team `frontend` chúng ta group tiếp theo các label `region` và `env`.
    - Match Alert: `match` sẽ xác định được tập các alert thỏa mãn điều kiện filer theo team.
- Inhibition Rule, chặn cảnh báo dạng cha-con. Ví dụ:
    ```yaml
    inhibit_rules:
        - source_match:
            severity: 'page-regionfail'
        target_match:
            severity: 'page'
        equal: ['region']
    ```
    - Trong ví dụ trên, nếu một alert với severity là page-regionfail được "firing". Nó sẽ thay thế tất cả cảnh báo có cùng region và severity là page.