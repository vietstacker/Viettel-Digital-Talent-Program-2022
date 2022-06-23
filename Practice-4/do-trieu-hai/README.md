# **PRACTICE-4 DEPLOY PROMETHEUS, GRAFANA, EXPORTER, ALERTMANAGER**

## I. **Overview**
 Overview kiến trúc `monitoring` bằng **prometheus**

<img src="./imgs/architecture.jpg">

### 1. **Prometheus**

**Prometheus** Prometheus là một bộ công cụ giám sát và cảnh báo hệ thống mã nguồn mở được phát triển bởi SoundCloud

**Prometheus** thu thập và lưu trữ các `metrics` của mình dưới dạng dữ liệu chuỗi thời gian, tức là thông tin chỉ số được lưu trữ với `timestamp` (dấu thời gian) mà tại đó nó được ghi lại, cùng với các cặp `key-value` tùy chọn được gọi là nhãn.

[**Tham khảo overview prometheus**](https://prometheus.io/docs/introduction/overview/)


<img src="./imgs/prometheusio.png">




**Exporter** Có một số thư viện và máy chủ giúp `export` các chỉ số hiện có từ các hệ thống của bên thứ ba dưới dạng Prometheus metrics.

[**Tham khảo prometheus exporter**](https://prometheus.io/docs/instrumenting/exporters/)




### 2. **Grafana**

<img src="./imgs/prometheus-grafana.png">

**Grafana** là một ngăn xếp cung cấp khả năng quan sát hoàn chỉnh cho phép bạn theo dõi và phân tích các chỉ số, nhật ký và dấu vết. Nó cho phép bạn truy vấn, trực quan hóa, cảnh báo và hiểu rõ dữ liệu của bạn bất kể nó được lưu trữ ở đâu. 

### 3. **Alertmanager**

<img src="./imgs/alert.png"> 

**Alertmanager** xử lý các cảnh báo được gửi bởi các `client application` như máy chủ Prometheus. Nó đảm nhận việc loại bỏ trùng lặp, nhóm và định tuyến chúng đến đúng nơi nhận như email, PagerDuty hoặc OpsGenie.


## **II. Deploy**

 
### 1. **Ansible**

[**Tham khảo practice 2**](https://github.com/vietstacker/Viettel-Digital-Talent-Program-2022/tree/main/Practice-2/do-trieu-hai)

### 2. **Role Docker**

[**Tham khảo practice 2**](https://github.com/vietstacker/Viettel-Digital-Talent-Program-2022/tree/main/Practice-2/do-trieu-hai)

### 3. **Role Prometheus**

Task role để deploy Prometheus

```
  - name: Pull Prometheus Docker image
    docker_image:
      name: prom/prometheus:latest
      source: pull
    
  - name: Copy prometheus.yml file to /tmp
    copy:
      src: prometheus.yml
      dest: /tmp
  
  - name: Copy alert.rules file to /tmp
    copy:
      src: alert.rules
      dest: /tmp

  - name: Run Prometheus Docker image
    docker_container:
      name: prometheus
      image: prom/prometheus:v2.0.0
      volumes:
        - ./prometheus/:/etc/prometheus/
        - prometheus_data:/prometheus
      command:
        - '--config.file=/etc/prometheus/prometheus.yml'
        - '--storage.tsdb.path=/prometheus'
        - '--web.console.libraries=/usr/share/prometheus/console_libraries'
        - '--web.console.templates=/usr/share/prometheus/consoles'
        - '--web.enable-lifecycle'
      ports:
        - 9090:9090
      restart: always
```

Cấu hình của Prometheus trong file prometheus.yml
```
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
  - targets: 
    - 192.168.56.111:9100

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - 192.168.56.111:9093

rule_files:
  - "alert.rules"

```

Trong đó, alert.rules là file định nghĩa những trường hợp sẽ được cảnh báo.

File alert.rules sẽ có dạng như sau:

```
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

```

[**Tham khảo các alert**](https://awesome-prometheus-alerts.grep.to/rules.html)






### 4. **Role Grafana**

Chạy các tasks sau để deploy Grafana
```
   - name: Pull Grafana Docker image
    docker_image:
      name: grafana/grafana-enterprise
      source: pull
    
  - name: Run Grafana Docker image
    docker_container:
      name: grafana
      image: grafana/grafana-enterprise
      restart_policy: unless-stopped
      volumes:
      - grafana_data:/var/lib/grafana
      ports:
      - "3000:3000" 
```

### 5. **Role Node Exporter**

Thực hiện các tasks sau để deploy Node Exporter
```
- name: Pull Node Exporter Docker image
    docker_image:
      name: prom/node-exporter:latest
      source: pull
    
  - name: Run Node Exporter Docker image
    docker_container:
      name: node-exporter
      image: prom/node-exporter:latest
      restart_policy: unless-stopped
      volumes:
        - /proc:/host/proc:ro
        - /sys:/host/sys:ro
        - /:/rootfs:ro
      command:
        - '--path.procfs=/host/proc'
        - '--path.sysfs=/host/sys'
        - --collector.filesystem.ignored-mount-points
        - "^/(sys|proc|dev|host|etc|rootfs/var/lib/docker/containers|rootfs/var/lib/docker/overlay2|rootfs/run/docker/netns|rootfs/var/lib/docker/aufs)($$|/)"
      ports:
        - 9100:9100
      restart: always
```

### 6. **Role Alertmanager**

Thực hiện các tasks sau để deploy Alertmanager
```
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
      image: prom/alertmanager:v0.12.0
      ports:
        - 9093:9093
      volumes:
        - ./alertmanager/:/etc/alertmanager/
      restart: always
      command:
        - '-config.file=/etc/alertmanager/config.yml'
        - '-storage.path=/alertmanager'
```

Trong đó, file alertmanager.yml dùng để cấu hình Alert manager đẩy cảnh báo về Gmail
```
global:
  resolve_timeout: 1m
  slack_api_url: 'https://hooks.slack.com/services/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'

route:
  receiver: 'slack-notifications'

receivers:
- name: 'slack-notifications'
  slack_configs:
  - channel: '#monitoring-instances'
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

```

[**Tham khảo cách đẩy các cảnh bảo**](https://grafana.com/blog/2020/02/25/step-by-step-guide-to-setting-up-prometheus-alertmanager-with-slack-pagerduty-and-gmail/)

### 7. **Final deploy**

Thực hiện các roles trong file `playbook.yml`
```

- host: all
  become: True
  become_method: sudo
  become_user: root
  become_ask_pass: False
  roles:
    - docker
    - prometheus
    - grafana
    - exporter
    - alertmanager

```

Chạy câu lệnh ansible để deploy
```
ansible-playbook -i inventory/hosts playbook.yml
```


**Kiểm tra kết quả**


Check Grafana:
<img src="./imgs/grafanarun.jpg">

Check Prometheus:
<img src="./imgs/runprometheus.jpg">


## **III. Tham khảo**
[**Bài của bạn Phùng Hoàng Long**](https://github.com/longph2710/Viettel-Digital-Talent-Program-2022/tree/practice4/Practice-4/PhungHoangLong)

**https://github.com/PagerTree/prometheus-grafana-alertmanager-example**

**https://prometheus.io/docs**