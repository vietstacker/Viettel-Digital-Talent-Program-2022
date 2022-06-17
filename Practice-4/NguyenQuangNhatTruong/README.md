# PRACTICE 4: DEPLOY PROMETHEUS + GRAFANA + NODE EXPORTER + ALERTMANAGER

## Table of contents

  - [**I. Overview**](#i-overview)
    - [1. Prometheus](#1-prometheus)
    - [2. Grafana](#2-grafana)
    - [3. Node Exporter](#3-node-exporter)
    - [4. Alert Manager](#4-alert-manager)
    - [5. Slack](#5-slack)
  - [**II. Deploy**](#ii-deploy)
    - [1. Deploy Docker](#1-deploy-docker)
    - [2. Deploy Prometheus](#2-deploy-prometheus)
    - [3. Deploy Grafana](#3-deploy-grafana)
    - [4. Deploy Node Exporter](#4-deploy-node-exporter)
    - [5. Deploy Alert Manager](#5-deploy-alert-manager)
    - [6. Run Playbook](#6-run-playbook)
  - [**III. References**](#iii-references)

## **Author words**

Vào thời điểm bài tập này được nộp, thì em đoán là bài tập của mình đã bị trừ xuống âm điểm rồi ạ :( nhưng em hi vọng các anh sẽ thông cảm vì đợt vừa rồi em bị dồn lịch thi. Ở dưới là ảnh các ca thi của em ạ.

![image](imgs/lich_thi.png)

## **I. Overview**

### 1. Prometheus

![image](imgs/prometheus_icon.jpg)

Prometheus là một dịch vụ theo dõi và cảnh báo về hệ thống. Đây là một dịch vụ mã nguồn mở (Open source) hoàn toàn miễn phí. SoundCloud đã khởi đầu xây dựng Prometheus từ năm 2012. Prometheus đã được rất nhiều hệ thống tin tưởng áp dụng. Dự án có một cộng đồng người đóng góp, phát triển rất tích cực.

Giờ đây Prometheus đã được tách khỏi SoundCloud và là một dự án mã nguồn mở độc lập. Năm 2016, Prometheus tham gia vào tổ chức CNCF (Cloud Native Computing Foundation) với vị trí được ưu tiên phát triển thứ hai sau K8s (Kubernetes).

Tính năng quan trọng nhất của Prometheus là thu thập thông số, dữ liệu từ các mục tiêu (dịch vụ) được nhắm đến theo khoảng thời gian nhất định đã được cài đặt trước. Ngoài ra còn các API khác thể hiện được kết quả, đánh giá bằng biểu thức quy tắc và đưa ra cảnh báo. Prometheus còn cung cấp một ngôn ngữ truy vấn rất mạnh PromQL, cực kì hữu ích khi giao tiếp với các dịch vụ monitor khác.

Một số tính năng của Prometheus

- Mô hình dữ liệu Time series đặc biệt phù hợp để theo dõi số liệu theo thời gian.
- Có ngôn ngữ truy vấn riêng PromQL rất mạnh mẽ.
- Tích hợp tốt với rất nhiều nền tảng ứng dụng.
- Yêu cầu hạ tầng để triển khai đơn giản.
- Hỗ trợ Push Gateway (khi làm việc với các dịch vụ tồn tại trong thời gian ngắn và hủy sau khi hoàn thành).
- Có hỗ trợ Service discovery hoặc cấu hình tĩnh để tìm, nhắm mục tiêu cần theo dõi.

### 2. Grafana

![image](imgs/grafana_logo.png)

Grafana là một giao diện/dashboard theo dõi hệ thống (opensource), hỗ trợ rất nhiều loại dashboard và các loại graph khác nhau để người quản trị dễ dàng theo dõi.

Grafana là một nền tảng open-source chuyên phục vụ mục đích theo dõi và đánh giá các số liệu thu được. Theo định nghĩa như vậy chúng ta có thể thấy tính ứng dụng của Grafana rất rộng chứ không chỉ trong khối IT.

Grafana có thể truy xuất dữ liệu từ Graphite, Elasticsearch, OpenTSDB, Prometheus và InfluxDB. Grafana là một công cụ mạnh mẽ để truy xuất và biểu diễn dữ liệu dưới dạng các đồ thị và biểu đồ.

Bất kì lĩnh vực nào có thể thu được dữ liệu theo dòng thời gian đều có thể hiển thị tối ưu trên Grafana. Ngoài khả năng kết nối đa dạng với các nguồn dữ liệu, phần giao diện của công cụ này rất thân thiền với người dùng. Dễ dàng đưa ra thông tin và cảnh báo.

### 3. Node Exporter

![image](imgs/node_exporter_logo.jpg)

Node Exporter là một chương trình exporter viết bằng ngôn ngữ Golang. Exporter là một chương trình được sử dụng với mục đích thu thập, chuyển đổi các metric không ở dạng kiểu dữ liệu chuẩn Prometheus sang chuẩn dữ liệu Prometheus. Sau đấy exporter sẽ expose web service api chứa thông tin các metrics hoặc đẩy về Prometheus.

Node Exporter này sẽ đi thu thập các thông số về máy chủ Linux như : ram, load, cpu, disk, network,…. từ đó tổng hợp và xuất ra kênh truy cập các metrics hệ thống này ở port TCP 9100 để Prometheus đi lấy dữ liệu metric cho việc giám sát.

### 4. Alert Manager

![image](imgs/alert_logo.png)

Đầu tiên bạn cần lưu ý một vấn đề là, hoạt động cảnh báo trong hệ thống Prometheus chia làm 2 phần :

- Phần 1: các rule cảnh báo được thiết lập ở Prometheus Server và gửi cảnh báo đó đến Alertmanager.
- Phần 2: Alertmanager sẽ quản lý các cảnh báo (alert), xử lý nội dung alert nếu có tuỳ biến này và điều hướng đầu tiếp nhận thông tin cảnh báo như email, chat platform, call,…

Đó là cách mà alert manager hoạt động. Qua đó bạn sẽ hình dung được alert manager dùng để làm gì.

### 5. Slack

![image](imgs/slack_logo.png)

Có thể tưởng tượng Slack là một “phòng chat” cho toàn bộ nhân viên trong công ty của bạn.

Nếu đã từng nghe về Internet Relay Chat (IRC) thì Internet Relay Chat (IRC) và Slack có chức năng khá giống nhau. Slack sẽ được chia thành các 'kênh' nhỏ cho các cuộc thảo luận nhóm,… hoặc bất cứ điều gì mà bạn muốn.

Slack được nhiều người xem là “sát thủ email”, ứng dụng là cách để “giảm bớt” các email nội bộ của bạn, và hãy quên việc giao tiếp, trao đổi bằng email hoặc các phần mềm chat thông thường đi.

Ưu điểm lớn nhất của Slack là đa nền tảng (máy tính, Android, iOS) nên tất cả mọi người trong công ty của bạn có thể chat nhóm với nhau bất kể họ dùng thiết bị gì đi nữa.

Trong bài này em sẽ sử dụng slack để nhận thông báo từ alert manager gửi đến.

## **II. Deploy**

Trước khi triển khai, chúng ta cần chuẩn bị sẵn 2 máy ảo Ubuntu, RAM minimum 4GB, Disk >=20GB.
Nội dung file inventory, gồm 1 máy monitor và 1 máy target node

    [monitor]
    localhost ansible_connection=local

    [node]
    192.168.56.101 ansible_ssh_user=truong01 ansible_ssh_pass=password

### 1. Deploy Docker

Dưới đây là các task cần thực hiện để deploy docker trên cả 2 máy ảo

'task/main.yml'

    - name: Install aptitude
      apt:
        name: aptitude
        state: latest

    - name: Install required system packages
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - software-properties-common
          - python3-pip
          - virtualenv
          - python3-setuptools
        state: latest

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

    - name: Install Docker Module for Python
      pip:
        name: docker

### 2. Deploy Prometheus

Các biến được sử dụng trong quá trình deploy roles prometheus này

    prometheus_dir_config: "/etc/prometheus"
    docker_name: "prometheus"
    docker_image: "prom/prometheus:latest"

Đầu tiên ta cần viết các file config cho prometheus hoạt động.

`files/prometheus.yml`

    global:
    scrape_interval: 15s
    evaluation_interval: 15s

    scrape_configs:
    - job_name: prometheus
    scrape_interval: 10s
    static_configs:
    - targets:
        - localhost:9090

    - job_name: node-exporter
    static_configs:
    - targets:  ['192.168.56.101:9100']

    alerting:
    alertmanagers:
    - static_configs:
        - targets: ['192.168.56.101:9093']

    rule_files:
    - "alert_rules.yml"

`files/alert_rules.yml`

    groups:
    - name: alertmanager
    rules:

        #Node memory is filling up (< 10% left)
        - alert: HostOutOfMemory
        expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 10
        for: 2m
        labels:
            severity: warning
        annotations:
            summary: Host out of memory (instance {{ $labels.instance }})
            description: "Node memory is filling up (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
        
        #The node is under heavy memory pressure. High rate of major page faults
        - alert: HostMemoryUnderMemoryPressure
        expr: rate(node_vmstat_pgmajfault[1m]) > 1000
        for: 2m
        labels:
            severity: warning
        annotations:
            summary: Host memory under memory pressure (instance {{ $labels.instance }})
            description: "The node is under heavy memory pressure. High rate of major page faults\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"

        #Disk is probably reading too much data (> 50 MB/s)
        - alert: HostUnusualDiskReadRate
        expr: sum by (instance) (rate(node_disk_read_bytes_total[2m])) / 1024 / 1024 > 50
        for: 5m
        labels:
            severity: warning
        annotations:
            summary: Host unusual disk read rate (instance {{ $labels.instance }})
            description: "Disk is probably reading too much data (> 50 MB/s)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"

        #Disk is probably writing too much data (> 50 MB/s)
        - alert: HostUnusualDiskWriteRate
        expr: sum by (instance) (rate(node_disk_written_bytes_total[2m])) / 1024 / 1024 > 50
        for: 2m
        labels:
            severity: warning
        annotations:
            summary: Host unusual disk write rate (instance {{ $labels.instance }})
            description: "Disk is probably writing too much data (> 50 MB/s)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
        
        #CPU load is > 80%
        - alert: HostHighCpuLoad
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80
        for: 0m
        labels:
            severity: warning
        annotations:
            summary: Host high CPU load (instance {{ $labels.instance }})
            description: "CPU load is > 80%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
        # Alert for any instance that is unreachable for >1 minutes.
        - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
            severity: page
        annotations:
            summary: "Instance {{ $labels.instance }} down"
            description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minutes."

Sau đó sẽ là nội dung file main để xây dựng docker container cho prometheus

`task/main.yml`

    ---
    # tasks file for prometheus
    - name: Pull Prometheus Docker image
    docker_image:
        name: "{{ docker_image }}"
        source: pull
        
    - name: Copy prometheus.yml file to /tmp
    copy:
        src: prometheus.yml
        dest: /tmp

    - name: Copy alert rules file to /tmp
    copy:
        src: alert_rules.yml
        dest: /tmp

    - name: Run Prometheus Docker image
    docker_container:
        name: "{{ docker_name }}"
        image: "{{ docker_image }}"
        restart_policy: unless-stopped
        volumes:
        - /tmp/prometheus.yml:{{prometheus_dir_config}}/prometheus.yml
        - /tmp/alert_rules.yml:{{prometheus_dir_config}}/alert_rules.yml
        command:
        - '--config.file={{prometheus_dir_config}}/prometheus.yml'
        ports:
        - 9090:9090

### 3. Deploy Grafana

`default/main.yml`

    docker_image: "grafana/grafana-enterprise:latest"
    docker_name: "grafana"

`task/main.yml`

    - name: Pull Grafana Docker image
      docker_image:
        name: "{{docker_image}}" 
        source: pull
      
    - name: Run Grafana Docker image
      docker_container:
        name: "{{docker_name}}"
        image: "{{docker_image}}"
        restart_policy: unless-stopped
        ports:
        - "3000:3000"
  
### 4. Deploy Node Exporter

`default/main.yml`

    docker_image: "prom/node-exporter:latest"
    docker_name: "node-exporter"

`task/main.yml`

    - name: Pull Node Exporter Docker image
      docker_image:
        name: "{{docker_image}}"
        source: pull
        
    - name: Run Node Exporter Docker image
      docker_container:
        name: "{{docker_name}}"
        image: "{{docker_image}}"
        restart_policy: unless-stopped
        ports: 
        - "9100:9100"

### 5. Deploy Alert Manager

`default/main.yml`

    docker_image: "prom/alertmanager:latest"
    docker_name: "alertmanager"
    alertmanager_dir_config: "/etc/alertmanager"

`files/alertmanager.yml`

    global:
    resolve_timeout: 5m

    route:
    group_by: ['alertname']
    group_wait: 10s
    group_interval: 10s
    repeat_interval: 24h
    receiver: 'slack'
    receivers:
    - name: 'slack'
        slack_configs:
            - send_resolved: true
            text: "<!channel> \nsummary: {{ .CommonAnnotations.summary }}\ndescription: {{ .CommonAnnotations.description }}"
            channel: '#prometheus_alert'
            api_url: 'https://hooks.slack.com/services/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'

`task/main.yml`

    - name: Pull Alertmanager Docker image
      docker_image:
        name: "{{docker_image}}"
        source: pull
        
    - name: Copy alertmanager.yml file to /tmp
      copy:
        src: alertmanager.yml
        dest: /tmp

    - name: Run Alertmanager Docker image
      docker_container:
        name: "{{docker_name}}"
        image: "{{docker_image}}"
        ports:
        - "9093:9093"
        restart_policy: unless-stopped
        volumes:
          - /tmp/alertmanager.yml:{{alertmanager_dir_config}}/alertmanager.yml
        command:
            - '--config.file={{alertmanager_dir_config}}/alertmanager.yml'
            - '--storage.path=/alertmanager'

### 6. Run Playbook

`playbook.yml`

    - hosts: all
      become: true
      roles: 
        - docker
    - hosts: monitor
      become: true
      roles: 
        - prometheus
        - grafana
           
    - hosts: node
      become: true
      roles:
        - node-export
        - alertmanager

Sau khi deploy xong, kiểm tra trạng thái của các docker trên 2 máy monitor và node.

![image](imgs/docker_ps1.png)

![image](imgs/docker_ps2.png)

Vào địa chỉ <http://localhost:9090> để xem giao diện của Prometheus

- target

![image](imgs/prometheus_targets.png)

- rules

![image](imgs/prometheus_rules.png)

Lát nữa chúng ta sẽ thử kiểm tra thông báo của rules instance down

Giao diện Grafana, sử dụng username: admin và password: admin để truy cập vào grafana. Sau đó config url và access cho grafana như hình dưới để hiển thị dữ liệu từ prometheus.

![image](imgs/grafana_config.png)

![image](imgs/grafana.png)

Giao diện Alert Manager

![image](imgs/alert_status.png)

Thử tắt hoạt node exporter, giao diện prometheus sẽ hiện lên như sau, có 1 rules đang ở trạng thái firing.

![image](imgs/prometheus_firing.png)

Chúng ta sẽ thấy thông báo được hiển thị trên cả alertmanager, và sau đó sẽ có 1 message gửi đến Slack để thông báo thông tin lỗi.

![image](imgs/alertmanager_noti.png)

![image](imgs/slack_message.png)

## **III. References**

- [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- [Install Docker Using Ansible](https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-docker-on-ubuntu-20-04)
- [Slack Configuration](https://hocchudong.com/huong-dan-cau-hinh-prometheus-tich-hop-canh-bao-qua-slack-phan-5/)
- [Alert Rules Configuration](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
- [Alert Rules Configuration 2](https://awesome-prometheus-alerts.grep.to/rules.html)
