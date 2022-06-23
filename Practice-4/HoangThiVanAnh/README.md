# Sử dụng Ansible, Docker, docker-cpmose để deploy Prometheus, Exporter, Alertmanager, Grafana

---

# **Table of Contents:**

## [I. Kiến thức cơ bản](#ktcb)
- ### [1. Prometheus](#pro)
- ### [2. Exporter](#exp)
- ### [3. Alertmanagere](#alt)
- ### [4. Grafana](#gra)

## [II. Cài đặt](#cd)

- ### [1. Cài đặt Ansible](#ansible)
- ### [2. Viết playbook và cấu hình các file liên quan](#playbook)
- ### [3. Slack](#slack)
- ### [4. Deploy](#dl)
- ### [5. Kết quả](#KQ)

## [III. References](#RE)
---
<a name="ktcb"></a>
## I. Các kiến thức cơ bản 
<a name="pro"></a>
### 1. Prometheus

**Prometheus** là một bộ công cụ giám sát và cảnh báo hệ thống mã nguồn mở ban đầu được xây dựng bởi công ty SoundCloud. Kể từ khi thành lập vào năm 2012, nhiều công ty và tổ chức đã áp dụng Prometheus vào hệ thống và dự án này có một cộng đồng người dùng và nhà phát triển rất tích cực.

**Prometheus** lưu trữ các sự kiện trong thời gian thực. Những sự kiện này có thể là bất cứ điều gì liên quan đến ứng dụng của bạn, chẳng hạn như mức tiêu thụ bộ nhớ, mức sử dụng mạng hoặc các yêu cầu gửi đến riêng lẻ.

<img src= /imgs/prometheus.jpg>

**Các thành phần trong hệ thống Prometheus**
- Máy chủ Prometheus đảm nhận việc lấy dữ liệu và lưu trữ dữ liệu time-series.
- Thư việc client cho các ứng dụng.
- Push Gateway Prometheus: sử dụng để hỗ trợ các job có thời gian thực hiện ngắn (tạm thời).  Đơn giản là các tác vụ công việc này không tồn tại lâu đủ để Prometheus chủ động lấy dữ liệu. Vì vậy là mà các dữ liệu chỉ số (metric) sẽ được đẩy về Push Gateway rồi đẩy về Prometheus Server.
- Đa dạng Exporter hỗ trợ giám sát các dịch vụ hệ thống và gửi về Prometheus theo chuẩn Prometheus mong muốn.
- AlertManager: dịch vụ quản lý, xử lý các cảnh báo (alert).
- Và rất nhiều công cụ hỗ trợ khác,..

**Một số tính năng**
- Mô hình dữ liệu đa chiều – time series được xác định bởi tên của số liệu (metric) và các cặp khóa – giá trị (key/value).
- Ngôn ngữ truy vấn linh hoạt.
- Hỗ trợ nhiều chế độ biểu đồ.
- Các máy chủ/thiết bị giám sát có thể được phát hiện thông qua service discovery hoặc cấu hình tĩnh.
- Hoạt động cảnh báo vấn đề linh động dễ cấu hình.
- Hỗ trợ Push các time series thông qua một gateway trung gian.
<a name="exp"></a>
### 2. Node Exporter
**Node Exporter**  là một chương trình exporter viết bằng ngôn ngữ Golang.

**Node Exporter**: export các metrics một con node (hiểu là một server) như CPU, RAM của node, dung lượng ổ đĩa, số lượng request tới node đấy, .etc.
<a name="gra"></a>
### 3. Grafana
**Grafana** là một giao diện/dashboard theo dõi hệ thống (opensource), hỗ trợ rất nhiều loại dashboard và các loại graph khác nhau để người quản trị dễ dàng theo dõi.

**Grafana** có thể truy xuất dữ liệu từ Graphite, Elasticsearch, OpenTSDB, Prometheus và InfluxDB. Grafana là một công cụ mạnh mẽ để truy xuất và biểu diễn dữ liệu dưới dạng các đồ thị và biểu đồ

<img src= /imgs/grafana.jpg>


**Grafana** là một nền tảng open-source chuyên phục vụ mục đích theo dõi và đánh giá các số liệu thu được. Theo định nghĩa như vậy chúng ta có thể thấy tính ứng dụng của Grafana rất rộng chứ không chỉ trong khối IT.

<a name="alt"></a>
### 4. Alertmanager

**Alertmanager** xử lý cảnh báo được gửi bởi ứng dụng như là Prometheus server. Nó có các cơ chế Grouping, inhibition, silence.
Giải thích một cách dễ hiểu là:
- Bạn thu thập dữ liệu monitor từ các endpoint và lưu trong database Prometheus.
- Bạn tạo các rule alert trong Prometheus, ví dụ: ram server > 70%.
- Và bạn đẩy các alert này về Alertmanager, nó sẽ xử lý việc trùng lặp alert, group các alert và gửi alert tới kênh thông báo mà bạn muốn: mail, telegram,…

* **Grouping**: Phân loại cảnh báo có các tính chất tương tự với nhau. Điều này thực sự hữu ích trong một hệ thống lớn với nhiều thông báo được gửi đồng thời. 
	
	Ví dụ: Một hệ thống với nhiều server mất kết nối đến cơ sở dữ liệu, thay vì rất nhiều cảnh báo được gửi về Alertmanager thì Grouping giuos cho việc giảm số lượng cảnh báo trùng lặp, thay vào đó là một cảnh báo để chúng ta có thể biết được chuyện gì đang xảy ra với hệ thống của bạn. 

* **Inhibition**: là một khái niệm về việc chặn thông báo cho một số cảnh báo nhất định nếu các cảnh báo khác đã được kích hoạt.

	Ví dụ: Một cảnh báo đang kích hoạt, thông báo cluster không thể truy cập (not reachable). Alertmanager có thể được cấu hình là tắt các cảnh báo khác liên quan đến cluster này nếu cảnh báo đó đang kích hoạt. Điều này lọc bớt những cảnh báo không liên quan đến vấn đề hiện tại.

* **Silence**: Silence là một cách đơn giản để tắt cảnh báo trong một thời gian nhất định. Nó được cấu hình dựa trên việc match với các điều kiện thì sẽ không có cảnh báo nào được gửi khi đó.

* **High avability**: Alertmanager hỗ trợ cấu hình để tạo một cluster với độ khả dụng cao.

<a name="cd"></a>
## II. Cài đặt Prometheus + Exporter + Alertmanager + Grafana
<a name="ansible"></a>
### 1. Cài đặt Ansible
Cài đặt ansible:
- Requirements:
  + Python 2 hoặc Python 3
  + Red Hat, Debian, Centos, Ubuntu, macOS
- On RHEL and Centos
```
sudo yum install ansible
```
- On Ubuntu
```
$ sudo apt-get install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt-get install ansible
```
- Install by Pip
```
sudo pip install ansible
```

Cấu hình Ansible

Đầu tiên ta tạo file ansible.cfg và cấu hình như sau:

```
[defaults]
host_key_checking = False
pipelining=True
```

Cấu hình inventory

Trong inventory ta chia làm 2 group: `server1` and `server2` như sau:

```
[server1]
localhost ansible_connection=local

[server2]
192.168.56.106 ansible_ssh_user=root ansible_ssh_pass=2122
```
<a name="playbook"></a>
### 2. Viết playbook và cấu hình các file liên quan
#### 2.1. Install Docker & docker-compose
- Thêm Docker Packages
```yaml
- hosts: all
  become: yes
  gather_facts: false
  tasks:
   - name: Install docker packages
     remote_user: ansible_ubuntu_demo
     apt:
       name: name: ['apt-transport-https','ca-certificates', 'curl', 'software-properties-common']
       state: present
       update_cache: yes
     tags:
     - docker
```

Thêm khóa GPG:

```yaml
- name: Add Docker GPG apt Key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present
```
Configure Docker Repo

```yaml
- name: Configure Docker for ubuntu stable repository
  remote_user: ansible_ubuntu_demo
  apt_repository:
    repo: deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable
    state: present
    update_cache: yes
  tags:
  - docker
```
Update Ubuntu packages 
```yaml
- name: Update apt packages
  remote_user: ansible_ubuntu_demo
  apt:
    update_cache: yes
  tags:
  - docker
```
 Cài đặt `docker-ce`:

```yaml
- name: Update apt and install docker-ce
  apt:
    name: docker-ce
    state: latest
```

Cài đặt module cho python

```yaml
- name: Install Docker Module for Python
  pip:
    name: docker
```
#### 2.2. Install Prometheus

pull image về 
```yaml
- name: Pull Prometheus Docker image
  docker_image:
    name: prom/prometheus:latest
    source: pull
```
- file `prometheus.yml`

```yaml
global:
  scrape_interval: 15s

scrape_configs:
- job_name: prometheus
  static_configs:
  - targets:
    - 127.0.0.1:9090

- job_name: node
  static_configs:
  - targets: 
    - 192.168.56.106:9100

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      #- localhost:9093
      - 192.168.56.106:9093

rule_files:
  - "/etc/prometheus/alert.rules.yml"
```
Copy file prometheus.yml to /tmp

```yaml
- name: Copy alert.rules.yml file to 
    copy:
      src: rules.yml
      dest: /tmp
```
Cấu hình file rules.yml

```yaml
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
      - alert: HostOutOfDiskSpace
    expr: (node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes < 10 and ON (instance, device, mountpoint) node_filesystem_readonly == 0
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: Host out of disk space (instance {{ $labels.instance }})
      description: "Disk is almost full (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }
```
Copy file rules.yml to /tmp

```yaml
- name: Copy prometheus.yml file to /tmp
  copy:
    src: prometheus.yml
    dest: /tmp
```

Run image bằng docker trên cổng 9090
```yaml
- name: Run Prometheus Docker image
    docker_container:
      name: prometheus
      image: prom/prometheus:latest
      restart_policy: unless-stopped
      volumes: 
      - /tmp/prometheus.yml:/etc/prometheus/prometheus.yml
      - /tmp/alert.rules.yml:/etc/prometheus/alert.rules.yml
      command:
            - '--config.file=/etc/prometheus/prometheus.yml'
      ports:
      - "9090:9090"
```

#### 2.3. Install Grafana

pull image.

```yaml
- name: Pull Grafana Docker image
  docker_image:
    name: grafana/grafana-enterprise:latest 
    source: pull
```

Run container

```yaml
- name: Run Grafana Docker image
  docker_container:
    name: grafana
    image: grafana/grafana-enterprise:latest
    restart_policy: unless-stopped
    ports:
    - "3000:3000"
```


#### 2.4. Install Node Exporter

pull image:

```yaml
- name: Pull Node Exporter Docker image
  docker_image:
    name: prom/node-exporter:latest
    source: pull
```

Run container Node Exporter.

```yaml
- name: Run Node Exporter Docker image
  docker_container:
    name: node-exporter
    image: prom/node-exporter:latest
    restart_policy: unless-stopped
    ports: 
    - "9100:9100"
```

#### 2.5. Install Alertmanager
pull image:

```yaml
- name: Pull Alertmanager Docker image
    docker_image:
      name: prom/alertmanager:latest
      source: pull
```

Run container.
```yaml
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
<a name="slack"></a>
### 3. Slack
**Slack** được nhiều người xem là “sát thủ email”, ứng dụng là cách để “giảm bớt” các email nội bộ của bạn, và hãy quên việc giao tiếp, trao đổi bằng email hoặc các phần mềm chat thông thường đi.

Ưu điểm lớn nhất của Slack là đa nền tảng (máy tính, Android, iOS) nên tất cả mọi người trong công ty của bạn có thể chat nhóm với nhau bất kể họ dùng thiết bị gì đi nữa.

![alt](./imgs/slack1.jpg)


Cấu hình file alertmanager.yml
```yaml
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

<a name="dl"></a>
### 4. Deploy


Ta có`./playbook.yml` file sẽ như sau:

```yaml
---
- hosts: all
  become: yes
  gather_facts: false
  tasks:
   - name: Install docker packages
     remote_user: ansible_ubuntu_demo
     apt:
       name: name: ['apt-transport-https','ca-certificates', 'curl', 'software-properties-common']
       state: present
       update_cache: yes
     tags:
     - docker
- name: Add Docker GPG apt Key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present

- name: Configure Docker for ubuntu stable repository
  remote_user: ansible_ubuntu_demo
  apt_repository:
    repo: deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable
    state: present
    update_cache: yes
  tags:
  - docker

- name: Update apt packages
  remote_user: ansible_ubuntu_demo
  apt:
    update_cache: yes
  tags:
  - docker

- name: Update apt and install docker-ce
  apt:
    name: docker-ce
    state: latest

- name: Install Docker Module for Python
  pip:
    name: docker
      
- hosts: sẻver1
  become: true
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
      src: alert.rules.yml
      dest: /tmp

  - name: Run Prometheus Docker image
    docker_container:
      name: prometheus
      image: prom/prometheus:latest
      restart_policy: unless-stopped
      volumes: 
      - /tmp/prometheus.yml:/etc/prometheus/prometheus.yml
      - /tmp/alert.rules.yml:/etc/prometheus/alert.rules.yml
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
    
- hosts: server2
  tasks:
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

Run playbook:

```
ansible-playbook -i inventỏy  playbook.yml
```

![alt](./imgs/playbook.jpg)
<a name="kq"></a>
### 5. Kết quả

#### 5.1. Prometheus
Truy cập vào `129.168.56.109:9090`
Kiểm tra các Targret.

![alt](./imgs/target.jpg)

![alt](./imgs/img1.jpg)

Kiểm tra các Rules.

![alt](./imgs/rules.jpg)

#### 5.2. Alertmanager

Truy cập vào `192.168.56.106:9093` để kiểm tra **Alertmanager**.

![alt](./imgs/status.jpg)

Kiểm tra slack thông báo trong slack.

![alt](./imgs/slack.jpg)

#### 5.3. Using Grafana

Truy cập vào: `localhost:3000`
Đăng nhập bằng tài khoản admin, mật khẩu admin

![alt](./imgs/welcome.jpg)

Thêm datasource vào **Grafana**

![alt](./imgs/img5.jpg)

![alt](./imgs/img6.jpg)

<a name="RE"></a>
## III. References

[Install Docker, docker-compse using Ansible](https://cloudinfrastructureservices.co.uk/how-to-install-docker-compose-using-ansible-playbook/))

[Prometheus with Grafana using Ansible](https://github.com/MiteshSharma/PrometheusWithGrafana)

[Prometheus rules](https://awesome-prometheus-alerts.grep.to/rules.html)

[Prometheus](https://prometheus.io/docs/introduction/overview/)

[Grafana](https://grafana.com/docs/grafana/latest/getting-started/getting-started/)
