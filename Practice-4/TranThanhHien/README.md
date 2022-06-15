## **Deploy stack Prometheus; Exporter; Alertmanager; Granfana**

## **Mục Lục**
  - [**I. Overview**](#i-overview)
    - [**1. Prometheus**](#1-prometheus)
      - [**a. Giới thiệu Prometheus?**](#a-giới-thiệu-prometheus)
      - [**b. Một số tính năng Prometheus**](#b-một-số-tính-năng-prometheus)
      - [**c. Kiến trúc Prometheus**](#c-kiến-trúc-prometheus)
      - [**d. Một số thuật ngữ**](#d-một-số-thuật-ngữ)
    - [**2. Grafana**](#2-grafana)
    - [**3. Node-Exporter**](#3-node-exporter)
    - [**4. Alertmanager**](#5-alertmanager)
  - [**II. Practicing**](#ii-practicing)
      - [**1. Prometheus**](#1-prometheus)
      - [**2. Alertmanager**](#2-alertmanager)
      - [**3. Playbook to Run**](#3-playbook-to-run)
  - [**III. Kiểm tra**](#iii-kiểm-tra)
  - [**IV. Tham khảo**](#iv-tham-khảo)

## **I. Overview**

### **1. Prometheus**

#### **a. Giới thiệu Prometheus**

- Prometheus là một bộ công cụ giám sát và cảnh báo hệ thống mã nguồn mở ban đầu được xây dựng bởi công ty SoundCloud. Kể từ khi thành lập vào năm 2012, nhiều công ty và tổ chức đã áp dụng Prometheus vào hệ thống và dự án này có một cộng đồng người dùng và nhà phát triển rất tích cực.

- Prometheus bây giờ đã trở thành một dự án mã nguồn mở độc lập và được duy trì độc lập với bất kỳ công ty nào. Prometheus đã tham gia vào tổ chức Cloud Native Computing Foundation vào năm 2016 với tư cách là dự án được ưu tiên phát triển lớn thứ hai, sau Kubernetes (k8s).

- Prometheus có khả năng thu thập thông số/số liệu (metric) từ các mục tiêu được cấu hình theo các khoảng thời gian nhất định, đánh giá các biểu thức quy tắc, hiển thị kết quả và có thể kích hoạt cảnh báo nếu một số điều kiện được thảo mãn yêu cầu.


#### **b. Một số tính năng Prometheus**
- Mô hình dữ liệu đa chiều – time series được xác định bởi tên của số liệu (metric) và các cặp khóa – giá trị (key/value).
- Ngôn ngữ truy vấn linh hoạt.
- Hỗ trợ nhiều chế độ biểu đồ.
- Nhiều chương trình tích hợp và hỗ trợ bởi bên thứ 3.
- Hoạt động cảnh báo vấn đề linh động dễ cấu hình.
- Chỉ cần 1 máy chủ là có thể hoạt động được.
- Hỗ trợ Push các time series thông qua một gateway trung gian.
- Các máy chủ/thiết bị giám sát có thể được phát hiện thông qua service discovery hoặc cấu hình tĩnh.

#### **c. Kiến trúc Prometheus**

![kientruc](img/kientruc.png)

- Prometheus thực hiện quá trình lấy các thông số/số liệu (metric) từ các job được chỉ định qua kênh trực tiếp hoặc thông qua dịch vụ Pushgateway trung gian. Sau đấy Prometheus sẽ lưu trữ các dữ liệu thu thập được ở local máy chủ. Tiếp đến sẽ chạy các rule để xử lý các dữ liệu theo nhu cầu cũng như kiểm tra thực hiện các cảnh báo mà bạn mong muốn.

- Các thành phần trong hệ thống Prometheus

   + Máy chủ Prometheus đảm nhận việc lấy dữ liệu và lưu trữ dữ liệu time-series.
   + Thư việc client cho các ứng dụng.
   + Push Gateway Prometheus: sử dụng để hỗ trợ các job có thời gian thực hiện ngắn (tạm thời).  Đơn giản là các tác vụ công việc này không tồn tại lâu đủ để Prometheus chủ động lấy dữ liệu. Vì vậy là mà các dữ liệu chỉ số (metric) sẽ được đẩy về Push Gateway rồi đẩy về Prometheus Server.
   + Đa dạng Exporter hỗ trợ giám sát các dịch vụ hệ thống và gửi về Prometheus theo chuẩn Prometheus mong muốn.
   + AlertManager: dịch vụ quản lý, xử lý các cảnh báo (alert).
   + Và rất nhiều công cụ hỗ trợ khác,..

#### **d. Một số thuật ngữ khi làm quen với Prometheus**

- Time-series Data: là một chuỗi các điểm dữ liệu, thường bao gồm các phép đo liên tiếp được thực hiện từ cùng một nguồn trong một khoảng thời gian.

- Alert : một cảnh báo (alert) là kết quả của việc đạt điều kiện thoả mãn một rule cảnh báo được cấu hình trong Prometheus. Các cảnh báo sẽ được gửi đến dịch vụ Alertmanager.

- Alertmanager: chương trình đảm nhận nhiệm vụ tiếp nhận, xử lý các hoạt động cảnh báo.

- Client Library: một số thư viện hỗ trợ người dùng có thể tự tuỳ chỉnh lập trình phương thức riêng để lấy dữ liệu từ hệ thống và đẩy dữ liệu metric về Prometheus.

- Endpoint: nguồn dữ liệu của các chỉ số (metric) mà Prometheus sẽ đi lấy thông tin.

- Exporter: exporter là một chương trình được sử dụng với mục đích thu thập, chuyển đổi các metric không ở dạng kiểu dữ liệu chuẩn Prometheus sang chuẩn dữ liệu Prometheus. Sau đấy exporter sẽ expose web service api chứa thông tin các metrics hoặc đẩy về Prometheus.

- Instance: một instance là một nhãn (label) dùng để định danh duy nhất cho một target trong một job .

- Job: là một tập hợp các target chung một nhóm mục đích. Ví dụ: giám sát một nhóm các dịch vụ database,… thì ta gọi đó là một job .

- PromQL: promql là viết tắt của Prometheus Query Language, ngôn ngữ này cho phép bạn thực hiện các hoạt động liên quan đến dữ liệu metric.

- Sample: sample là một giá trị đơn lẻ tại một thời điểm thời gian trong khoảng thời gian time series.

- Target: một target là định nghĩa một đối tượng sẽ được Prometheus đi lấy dữ liệu (scrape).Ví dụ như: nhãn nào sẽ được sử dụng cho đối tượng, hình thức chứng thực nào sử dụng hoặc các thông tin cần thiết để quá trình đi lấy dữ liệu ở đối tượng được diễn ra.

### **2. Grafana**
- Grafana là một giao diện/dashboard theo dõi hệ thống (opensource), hỗ trợ rất nhiều loại dashboard và các loại graph khác nhau để người quản trị dễ dàng theo dõi.
- Grafana là một nền tảng open-source chuyên phục vụ mục đích theo dõi và đánh giá các số liệu thu được. Theo định nghĩa như vậy chúng ta có thể thấy tính ứng dụng của Grafana rất rộng chứ không chỉ trong khối IT.
- Grafana có thể truy xuất dữ liệu từ Graphite, Elasticsearch, OpenTSDB, Prometheus và InfluxDB. Grafana là một công cụ mạnh mẽ để truy xuất và biểu diễn dữ liệu dưới dạng các đồ thị và biểu đồ.
- Bất kì lĩnh vực nào có thể thu được dữ liệu theo dòng thời gian đều có thể hiển thị tối ưu trên Grafana. Ngoài khả năng kết nối đa dạng với các nguồn dữ liệu, phần giao diện của công cụ này rất thân thiền với người dùng. Dễ dàng đưa ra thông tin và cảnh báo.
- Việc xây dựng Dashboard nó là một phần quan trọng trong việc monotor của hệ thống. Grafana support rất nhiều giải pháp monitor khác nhau.

### **3. Node-Exporter**
- Prometheus Node Exporter là một chương trình exporter viết bằng ngôn ngữ Golang. Exporter là một chương trình được sử dụng với mục đích thu thập, chuyển đổi các metric không ở dạng kiểu dữ liệu chuẩn Prometheus sang chuẩn dữ liệu Prometheus.

### **4. Alertmanager**
Hoạt động cảnh báo trong hệ thống Prometheus chia làm 2 phần :

  - Phần 1: các rule cảnh báo được thiết lập ở Prometheus Server và gửi cảnh báo đó đến Alertmanager.
  - Phần 2: Alertmanager sẽ quản lý các cảnh báo (alert), xử lý nội dung alert nếu có tuỳ biến này và điều hướng đầu tiếp nhận thông tin cảnh báo như email, chat platform, call,…
## **II. Practicing**

### **1. Prometheus**
- nano rules.yml
  
  ```
     groups:
    - name: rules
      rules:
      - alert: HostHighCpuLoad
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: Host high CPU load (instance {{ $labels.instance }})
          description: "CPU load is > 80%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      - alert: HostOutOfMemory
        expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: Host out of memory (instance {{ $labels.instance }})
          description: "Node memory is filling up (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      - alert: HostPhysicalComponentTooHot
        expr: node_hwmon_temp_celsius > 75
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: Host physical component too hot (instance {{ $labels.instance }})
          description: "Physical hardware component too hot\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      - alert: InstanceDown
        expr: up == 0
        for: 1m
        annotations:
          title: 'Instance {{ $labels.instance }} down'
          description: '{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minute.'
        labels:
            severity: 'critical'
      - alert: ContainerKilled
        expr: time() - container_last_seen > 60
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: Container killed (instance {{ $labels.instance }})
          description: "A container has disappeared\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      - alert: ContainerCpuUsage
        expr: (sum(rate(container_cpu_usage_seconds_total{name!=""}[3m])) BY (instance, name) * 100) > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: Container CPU usage (instance {{ $labels.instance }})
          description: "Container CPU usage is above 80%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
  ```

- nano prometheus.yml

  ```
      global:
      scrape_interval: 15s

    scrape_configs:
    - job_name: prometheus
      static_configs:
      - targets:
        - 192.168.56.106:9090

    - job_name: node
      static_configs:
      - targets: 
        - 192.168.56.106:9100

    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          - 192.168.56.106:9093

    rule_files:
      - "/etc/prometheus/rules.yml"
  ```

### **2. Alertmanager**

- altermanager.yml

  ```
    global:
      resolve_timeout: 1m

    route:
      group_by: ['alertname']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 1h
      receiver: 'slack-notifications'
    receivers:
    - name: 'slack-notifications'
      slack_configs:
      - api_url: https://hooks.slack.com/services/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
        channel: '#monitoring'
        send_resolved: true

    inhibit_rules:
      - source_match:
          severity: 'critical'
        target_match:
          severity: 'warning'
        equal: ['alertname', 'dev', 'instance']
  ```

###**3. Playbook to Run**

- playbook.yml

  ```
    - hosts: all
      become: yes
      gather_facts: false
      tasks:

      - name: Pull Prometheus Docker image
        docker_image:
          name: prom/prometheus:latest
          source: pull

      - name: Copy prometheus.yml file to /tmp
        copy:
          src: prometheus.yml
          dest: /tmp

      - name: Copy alert.rules.yml file to 
        copy:
          src: rules.yml
          dest: /tmp

      - name: Run Prometheus Docker image
        docker_container:
          name: prometheus
          image: prom/prometheus:latest
          restart_policy: unless-stopped
          volumes: 
          - /tmp/prometheus.yml:/etc/prometheus/prometheus.yml
          - /tmp/rules.yml:/etc/prometheus/rules.yml
          command:
                - '--config.file=/etc/prometheus/prometheus.yml'
          ports:
          - "9090:9090"

      - name: Pull Grafana Docker image
        docker_image:
          name: grafana/grafana-enterprise
          source: pull

      - name: Run Grafana Docker image
        docker_container:
          name: grafana
          image: grafana/grafana-enterprise
          restart_policy: unless-stopped
          ports:
          - "3000:3000"

      - name: Pull Node Exporter Docker image
        docker_image:
          name: prom/node-exporter:latest
          source: pull

      - name: Run Node Exporter Docker image
        docker_container:
          name: node-exporter
          image: prom/node-exporter:latest
          restart_policy: unless-stopped
          ports: 
          - "9100:9100"

      - name: Pull Alertmanager Docker image
        docker_image:
          name: prom/alertmanager:latest
          source: pull

      - name: alertmanager.yml file to /tmp
        copy:
          src: alertmanager.yml
          dest: /tmp

      - name: Run Alertmanager Docker image
        docker_container:
          name: alertmanager
          image: prom/alertmanager:latest
          ports:
          - "9093:9093"
          restart_policy: unless-stopped
          volumes:
            - /tmp/alertmanager.yml:/alertmanager.yml
          command:
              - '--config.file=/alertmanager.yml'
  ```

## **III. Kiểm tra**

  ![node](img/node.png)

  ![rules](img/rules.png)

  ![status](img/status.png)

  ![target](img/target.png)
  
  ![grafana](img/grafana.png)
  
  ![prometheus](img/prometheus.png)
  
  ![node_exporterfull](img/node_exporterfull.png)

## **IV. Tham khảo**

<https://github.com/Einsteinish/Docker-Compose-Prometheus-and-Grafana>
<https://cuongquach.com/prometheus-la-gi-tong-quan-prometheus.html>
