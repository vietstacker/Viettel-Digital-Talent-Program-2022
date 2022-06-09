# TABLE OF CONTENT

- [TABLE OF CONTENT](#table-of-content)
- [1. Tổng quan về hệ thống triển khai monitoring](#1-tổng-quan-về-hệ-thống-triển-khai-monitoring)
- [2. Tổng quan về mô hình HA cho Prometheus và Alertmanager](#2-tổng-quan-về-mô-hình-ha-cho-prometheus-và-alertmanager)
- [3. Các bước triển khai](#3-các-bước-triển-khai)
  - [3.1. File inventory](#31-file-inventory)
  - [3.2. Cài đặt Docker trên tất cả các bước](#32-cài-đặt-docker-trên-tất-cả-các-bước)
  - [3.3. Triển khai Node Export và Redis](#33-triển-khai-node-export-và-redis)
  - [3.4. Triển khai Prometheus](#34-triển-khai-prometheus)
  - [3.5. Triển khai Alertmanager](#35-triển-khai-alertmanager)
  - [3.6. Triển khai Grafana](#36-triển-khai-grafana)
- [4. Chạy Ansible và kết quả](#4-chạy-ansible-và-kết-quả)

# 1. Tổng quan về hệ thống triển khai monitoring

Ta sẽ triển khai hệ thống monitoring bằng ansible và docker, mỗi host ta tạm thời chạy 1 container cho ứng dụng redis. Mỗi host sẽ có chạy container Node Exporter export để monitoring các host và container cAdvisor để monitoring các container. ệ thống này cũng sẽ triển khai HA (High Availability) cho Prometheus và Alertmanager.

Ta sẽ có 3 máy ảo, cụ thể:

- Máy 10.211.55.34: máy này sẽ dùng để triển khai Prometheus, Grafana, Node Exporter, cAdvisor, Redis.
- Máy 10.211.55.35: máy này sẽ dùng để triển khai Prometheus Alertmanager, Node Exporter, cAdvisor, Redis.
- Máy 10.211.55.36: máy này sẽ dùng để triển khai Alertmanager, Node Exporter, cAdvisor, Redis.

# 2. Tổng quan về mô hình HA cho Prometheus và Alertmanager

Trong bài này, ta sẽ sử dụng một mô hình naive nhất có thể đó chính là tạo 2 instance Prometheus với cấu hình giống y hệt nhau, nó sẽ scrape các target cũng giống hết nhau. Do đó các metrics của nó là tương đối giống nhau. Tuy vậy, sự bất đồng bộ về thời gian vẫn xảy ra nhưng không đáng kể. Ngoài ra, mô hình này bắt ta sẽ phải ghi lại địa chỉ của 2 instance này, ta có thể sử dụng 2 instance này bất cứ lúc nào. Điều này cũng khá hỗn loạn do ta không biết nên sử dụng instance nào và vào lúc nào. Một giải pháp là ta có thể sử dụng một load balancer như nginx. Nhưng để đơn giản thì ta chỉ dừng lại ở việc tạo 2 instance giống nhau. Ngoài load balancer, ta có thể sử dụng một số mô hình như replicated state machine như k8s sử dụng Raft. Hoặc ta cũng có thể sử dụng Docker Swarm.

Tiếp theo, đối với Alertmanager thì cơ chế HA đã được hỗ trợ thông qua cấu hình cluster, mỗi Alertmanger sẽ kết nối với nhau giao tiếp với nhau trong cluster đảm bảo tính duy nhất của alert và đảm bảo HA. Mỗi instance của Promethus cũng sẽ phải đẩy alert tới tất cả các instance Alertmanager trong cluster.

# 3. Các bước triển khai

Ta sẽ triển khai hệ thống monitoring này thống qua ansible. Để đơn giản, mỗi bước triển khai ta sẽ viết thành một roles riêng.

## 3.1. File inventory

Như đã đề cập ở phần đầu, ta sẽ chia ra làm các thành phần:

- prometheus_servers: gồm các host 10.211.55.34, 10.211.55.35
- alert_servers: gồm các host 10.211.55.35, 10.211.55.36
- grafana_server: gồm host 10.211.55.34
- all: gồm tất cả các host trên

## 3.2. Cài đặt Docker trên tất cả các bước

    host: all

Bước này khá đơn giản, do đã trình bày ở Practice 2 nên ta chỉ cần tận dụng [role này](ansible/roles/docker/tasks/main.yml):

    - name: Update APT package index
      apt:
        update_cache: yes
      become: yes
    - name: Install required system packages
      apt:
        pkg:
          - ca-certificates
          - curl
          - gnupg
          - lsb-release
          - python3-pip
          - virtualenv
          - python3-setuptools
      become: yes
    - name: Add Docker's official GPG Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present
      become: yes
    - name: Add Docker Repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu focal stable
        state: present
      become: yes
    - name: Update APT package index
      apt:
        update_cache: yes
      become: yes
    - name: Install Docker Engine, containerd and Docker Compose
      apt:
        pkg:
          - docker-ce
          - docker-ce-cli
          - containerd.io
          - docker-compose-plugin
      become: yes
    - name: Install Docker Module for Python
      pip:
        name: docker
      become: yes
    - name: Install Docker compose Module for Python
      pip:
        name: docker-compose
      become: yes

## 3.3. Triển khai Node Export và Redis

    host: all

Trước hết ta viết [docker-compose](ansible/roles/exporter/files/docker-compose.yml) để triển khai 2 image này:

    version: "3.9"
    services:
      cadvisor:
        image: zcube/cadvisor
        container_name: cadvisor
        volumes:
          - /:/rootfs:ro
          - /var/run:/var/run:ro
          - /sys:/sys:ro
          - /var/lib/docker/:/var/lib/docker:ro
          - /dev/disk/:/dev/disk:ro
        privileged: true
        devices:
          - /dev/kmsg
        ports:
          - 8080:8080
        depends_on:
          - redis
      node_exporter:
        image: prom/node-exporter
        container_name: node_exporter
        ports:
          - 9100:9100
      redis:
        image: redis
        container_name: redis
        ports:
          - 6379:6379

    networks:
      default:
        name: mornitor_net

Các volume được tạo ra theo toturial của cAdvisor, cổng metric của cAdvisor là 8080. Đối với redis cũng tương tự vậy. Sau đó ta viết [task ansible](ansible/roles/exporter/tasks/main.yml) để triển khai docker compose này trên 3 host:

    - name: Create directory for deployment of node exporter
      file:
      path: /etc/docker
      state: directory
      become: true
    - name: Copy docker compose to hosts
      copy:
      src: docker-compose.yml
      dest: /etc/docker/docker-compose.yml
      follow: yes
    - name: Run docker compose
      community.docker.docker_compose:
      project_src: /etc/docker

## 3.4. Triển khai Prometheus

    host: prometheus_servers

Trước hết ta sẽ viết [file config cho prometheus](ansible/roles/prometheus/templates/prometheus.j2). Ta sẽ sử dụng template j2 của ansible để linh động trong việc triển khai. Cụ thể:

    global:
      scrape_interval: 15s
      evaluation_interval: 15s

    rule_files:
      - "/etc/prometheus/alert_rules.yml"
      - "/etc/prometheus/node_rules.yml"

    alerting:
      alertmanagers:
        - static_configs:
          - targets: [{%for host in groups['alert_servers']%}"{{hostvars[host].ansible_eth0.ipv4.address}}:9093"{% if not loop.last %},{% endif %}{% endfor %}]

    scrape_configs:
      - job_name: prometheus
        static_configs:
          - targets: [{%for host in groups['prometheus_servers']%}"{{hostvars[host].ansible_eth0.ipv4.address}}:9090"{% if not loop.last %},{% endif %}{% endfor %}]

      - job_name: node
        static_configs:
          - targets: [{%for host in groups['all']%}"{{hostvars[host].ansible_eth0.ipv4.address}}:9100"{% if not loop.last %},{% endif %}{% endfor %}]

      - job_name: cadvisor
        static_configs:
          - targets: [{%for host in groups['all']%}"{{hostvars[host].ansible_eth0.ipv4.address}}:8080"{% if not loop.last %},{% endif %}{% endfor %}]

Biến scrape_interval để cấu hình khoảng thời gian pull metrics về của prometheus, evaluation_interval cấu hình thời gián đánh giá alert rules. Ở đây ta dều để là 15s.

Tiếp đến là file rules đầu tiền, alert rules ([alert_rules.yml](ansible/roles/prometheus/files/alert_rules.yml)) có nội dung như sau:

    groups:
      - name: Alert
        rules:
          # Alert for any instance that is unreachable for >5 minutes.
          - alert: InstanceDown
            expr: up == 0
            for: 5m
            labels:
              severity: "critical"
              alertname: "instancedown"
            annotations:
              summary: "Instance {{ $labels.instance }} down"
              description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 5 minutes."

Ở đây, ta chỉ khai một rule alert duy nhất để cảnh bảo khi có một instance dừng hoạt động (up == 0) quá 5 phút (for: 5m). Khi khai báo rule ta có thể label rule bằng trường labels như ở đây ta label nó là critical. Đồng thời, alert cũng hỗ trợ template để tạo thông báo trong trường annotations. Như ta viết thì khi render ra description thì prometheus sẽ có input là biến $labels sau đó thay các biến sử dụng trong dấu {{}} bằng giá trị của nó.

Tiếp đến ta node_rules, rule này là một recording rule có nhiệm vụ tiền xử lí các metric để tạo ra các metric (record) có nội dụng với mục đích định trước, chẳng hạn nhữ để biểu diễn các biểu đồ trong Grafana (lúc này grafana chỉ cần lấy các metric đã qua xử lí -> dễ dàng, hiệu quả). Trong file này được lấy từ rules trong trang của Node Exporter ([node_rules.yml](ansible/roles/prometheus/files/node_rules.yml) để dùng trong việc tạo dashboard trong Grafana. Ta sẽ lấy 1 rule của trong file này ra để phân tích:

    - "expr": |
        count without (cpu) (
          count without (mode) (
            node_cpu_seconds_total{job="node"}
          )
        )
      "record": "instance:node_num_cpu:sum"

Với metric node_cpu_seconds_total, ta sẽ đếm số lượng các metric giống hệt nhau khi ta loại bỏ trường cpu và mode, nói cách khác, ta sẽ đếm được số lượng cpu của 1 instace và output nó ra record instance:node_num:sum (một metric mới). Lúc này, khi ta sử dụng Grafana, ta chỉ cần lấy node_num chứ không phả sử lí bằng các query phức tạp nữa, giúp tăng hiệu quả và tốc độ của Grafana cũng như Prometheus.

Tiếp theo là ta sẽ tiến hành config các alertmanager để đẩy các alert cho alertmanager. Như đã viết từ phần trước, ta sẽ có 2 instance alertmanager vì vậy ta sẽ đẩy cho cả 2 instance này. Ở đây ta sử dụng vòng loop của jinja2 template để lấy địa chỉ của host từ ansible thay vào trong file config.

Tương tự với Prometheus, Node Exporter và cAdvisor, ta cũng cấu hình địa chỉ cũng như số cổng của chúng sử dụng vòng loop của jinja2 template.

Sau khi viết xong các file trên, ta [viết ansible](ansible/roles/prometheus/tasks/main.yml) để copy các file này vào trong host:

    - name: Create directory for deployment of prometheus
      file:
        path: /etc/prometheus-deploy
        state: directory
      become: true
    - name: Copy prometheus config to host
      template:
        src: prometheus.j2
        dest: /etc/prometheus-deploy/prometheus.yml
        follow: yes
    - name: Copy docker-compose to host
      copy:
        src: docker-compose.yml
        dest: /etc/prometheus-deploy/docker-compose.yml
    - name: Copy Dockerfile to host
      copy:
        src: Dockerfile
        dest: /etc/prometheus-deploy/Dockerfile
    - name: Copy alert rule files to host
      copy:
        src: alert_rules.yml
        dest: /etc/prometheus-deploy/alert_rules.yml
    - name: Copy node rule files to host
      copy:
        src: node_rules.yml
        dest: /etc/prometheus-deploy/node_rules.yml

Sau khi copy thì ta cần [build lại image](ansible/roles/prometheus/files/Dockerfile) prometheus với các file config và rules mà ta vừa mới viết:

    FROM prom/prometheus
    ADD prometheus.yml /etc/prometheus/
    ADD alert_rules.yml /etc/prometheus/alert_rules.yml
    ADD node_rules.yml /etc/prometheus/node_rules.yml

Ta chỉ đơn giản copy các file này vào trong image. Cuối cùng là viết [docker-compose.yml](ansible/roles/prometheus/files/docker-compose.yml) để chạy container prometheus với cổng 9090:

    version: "3.9"

    services:
      prometheus:
        build: .
        container_name: prometheus
        ports:
          - 9090:9090

    networks:
      default:
        name: mornitor_net
        external: true

Cuối cùng là viết task ansible để chạy file docker-compose này. Như vậy ta đã hoàn thành xong viết task cho Prometheus.

## 3.5. Triển khai Alertmanager

    hosts: alert_servers

Như vậy sau khi có Prometheus, thì ta cần triển khai Alertmanage instance. Ở đây ta sẽ cần 2 instance để đảm bảo HA. Ta cần build lại image này để nó cấu hình lại cluster cho Alertmanager như sau:

    FROM prom/alertmanager

    COPY alertmanager.yml /etc/alertmanager/alertmanager.yml

    ENTRYPOINT ["/bin/alertmanager", "--config.file=/etc/alertmanager/alertmanager.yml" {%for host in groups['alert_servers']%}{% if hostvars[host].ansible_eth0.ipv4.address != hostvars[inventory_hostname].ansible_eth0.ipv4.address %}, "--cluster.peer={{hostvars[host].ansible_eth0.ipv4.address}}:9094"{% endif %}{% endfor %}]

Trước hết ta sẽ copy file alertmanager.yml này vào để cấu hình nó (sẽ giải thích ở bước tiếp theo). Điểm tiếp theo là hiện tại ta phải viết lại entrypoint cho image này để thêm biến --cluster.peer=IP của peer cho từng instance. Ở đây, ta sẽ sử dung jinja2 template để chạy vòng loop trong các alert_servers rồi thêm argument cluster.peer với các địa chỉ IP khác địa chỉ IP của host ta đang làm để host này có thể giao tiếp với các peer (qua port 9094), đảm bảo tínht thống nhất cũng như HA của Alertmanager (ta có thể cấu hình thêm nữa thông qua các biến [tại đây](https://github.com/prometheus/alertmanager).

Tiếp theo là file [alermanager.yml](ansible/roles/alertmanager/files/alertmanager.yml) để config Alertmanager gửi thông báo tới slack mỗi khi một alert được trigger. Alert manager cũng hỗ trợ templating nội dung của thông báo, giúp chúng ta custom được thông báo của mình trong slack:

    global:
      slack_api_url: "https://hooks.slack.com/services/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"

    route:
      receiver: "slack-notifications"

    receivers:
      - name: "slack-notifications"
        slack_configs:
          - channel: "#monitoring-system"
            send_resolved: true
            icon_url: https://avatars3.githubusercontent.com/u/3380462
            title: |-
              [{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .CommonLabels.alertname }} for {{ .CommonLabels.job }}
              {{- if gt (len .CommonLabels) (len .GroupLabels) -}}
                {{" "}}(
                {{- with .CommonLabels.Remove .GroupLabels.Names }}
                  {{- range $index, $label := .SortedPairs -}}
                    {{ if $index }}, {{ end }}
                    {{- $label.Name }}="{{ $label.Value -}}"
                  {{- end }}
                {{- end -}}
                )
              {{- end }}
            text: >-
              {{ range .Alerts -}}
              *Alert:* {{ .Annotations.title }}{{ if .Labels.severity }} - `{{ .Labels.severity }}`{{ end }}

              *Description:* {{ .Annotations.description }}

              *Details:*
                {{ range .Labels.SortedPairs }} • *{{ .Name }}:* `{{ .Value }}`
                {{ end }}
              {{ end }}

Để có được slack_api_url, ta cần add integration vào slack của chúng ta rồi lấy api url là được:

![add-integration-slack](images/add-slack-integration.png)

Như vậy, ta đã cấu hình xong Alertmanager, mỗi khi Prometheus tigger alert và chuyển đến Alertmanager thì thông báo cũng sẽ được chuyển tới kênh chat "#monitoring-system" của slack mà ta vừa cấu hình.

Cuối cùng là ta viết [docker-compose.yml](ansible/roles/alertmanager/files/docker-compose.yml) để rồi [ansible](ansible/roles/alertmanager/tasks/main.yml) để chạy docker-compose này.

## 3.6. Triển khai Grafana

    hosts: grafana_server

Với Grafana, ta chỉ đơn giản chạy docker-compose với image của Grafana và publish port 3000:

    version: "3.9"

    services:
      grafana:
        image: grafana/grafana-enterprise
        container_name: grafana
        ports:
          - 3000:3000

    networks:
      default:
        name: mornitor_net
        external: true

# 4. Chạy Ansible và kết quả

Sau khi chạy [ansible-playbook](ansible/playbook-roles.yml) ta thu được kết quả chạy thành công:

![ansible_playbook](images/ansible-playbook.png)

Tiếp đó, ta có kiểm tra Prometheus tại 10.211.55.34:9090:

![prometheus_check](images/prometheus-check.png)

Tiếp tục, ta kiểm tra các rules đã được chạy thành công hay chưa:

![alert_rules](images/alert_rules.png)

![node_rules](images/node_rules.png)

Các target:

![target](images/target.png)

Tiếp theo ta hãy thử, tắt stop 1 container xem alert đã hoạt động hay chưa:

![alert_pending](images/alert_pending.png)

Như vậy alert đã chuyển trạng thái thành pending do có 1 node bị down. Sau khi đủ 5 phút, thì alert sẽ được trigger, lúc này nó sẽ được đẩy sang Alertmanger và Alermanger sẽ đẩy về Slack:

![alert_trigger](images/alert_trigger.png)

Ngay sau đó, slack cũng nhận được 1 thông báo từ Alertmanager:

![slack_noti](images/slack_notification.png)

Bây giờ ta sẽ dừng một Alertmanager instance và bật lại Node Exporter vừa tắt xem có nhận đươc thông báo InstanceDown đã được resolve hay chưa (thử xem tính HA có được đảm bảo):

![alert_resolve](images/alert_resolve.png)

Như vậy tính HA được đảm bảo và chịu được tối đa 1 lỗi của instance.

Cuối cùng ta sẽ cùng thiết lập Grafana để biểu diễn trực quan hơn việc monitor.

Đầu tiên ta sẽ tạo Dashboard sử dụng metrics của Node Exporter để monitoring host. Ta sử dụng metric node_cpu_seconds_total{mode="system"} để tính lượng thời gian trung bình CPU dùng trong chế độ system trong 1 giây thông qua hàm rate như sau:

    rate(node_cpu_seconds_total{mode="system"}[1m])

Tạo một panel với query trên để biểu diễn trực quan:

![cpu_time](images/cpu_time.png)

Tạo tiếp một panel quản lý tượng traffic đi của cổng eth0 của các host trung bình trong 1 giây trong 1 phút gần nhất:

    rate(node_network_receive_bytes_total{device="eth0"}[1m])

![dashboard_host](images/dashboard_host.png)

Một cách khác là ta có thể sử dụng các Dashboard có sẵn của Node Exporter mà sử dụng các Record Rules của Node mà ta đã thêm vào ở bước 3.4, như sau:

![import_dashboard](images/import_dashboard.png)

Kết quả:

![dashboard_import_result](images/dashboard_import_result.png)

Cuối cùng, ta cùng thử các metric của cAdvisor để thử monitoring các Redis container mà ta đã chạy. Ta thử sử dụng container_network_receive_packets_total để tính số lượng gói tin TCP mà redis nhận được trung bình trong 1s trong khoảng 1 phút gần nhất để monitoring traffic của redis như sau:

    rate(container_network_receive_packets_total{name="redis"}[1m])

Tiếp tục ta có thể tính thời gian sử dụng trung bình CPU trong vòng 1 giây trong 1 phút gần nhất của mỗi instance redis, do mỗi instance redis có nhiều CPU, nên ta phải tính trung bình bằng cách cộng tộng các số lại bằng sum without (cpu) rồi chia số số lượng cpu là count without(cpu) như sau:

    sum without(cpu) (rate(container_cpu_usage_seconds_total{name="redis"}[1m])) / count without (cpu) (container_cpu_usage_seconds_total{name="redis"})

Ta trực quan hoá 2 query này bằng biểu đồ time series:

![redis_monitoring](images/redis_monitoring.png)

Như vậy, ta đã triển khai xong một hệ thống monitoring. Tuy vật, hệ thống nãy sẽ vẫn còn nhiều điểu phải cải tiến và đồng thời viết nhiều hơn các query để monitoring được nhiều vấn đề hơn.
