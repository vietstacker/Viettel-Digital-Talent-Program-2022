# TABLE OF CONTENT

- [TABLE OF CONTENT](#table-of-content)
- [1. Build project image](#1-build-project-image)
  - [1.1. Tổng quan về source code](#11-tổng-quan-về-source-code)
  - [1.2. Build web server image](#12-build-web-server-image)
  - [1.3. Build database image](#13-build-database-image)
- [2. Cài đặt và thiết lập Ansible, VM](#2-cài-đặt-và-thiết-lập-ansible-vm)
  - [2.1. Cài đặt máy ảo](#21-cài-đặt-máy-ảo)
  - [2.2. Cài đặt Ansible](#22-cài-đặt-ansible)
  - [2.3. Thiết lập public key để ssh vào VM](#23-thiết-lập-public-key-để-ssh-vào-vm)
  - [2.4. Configure Ansible](#24-configure-ansible)
  - [2.5. Cài đặt các module cần thiết để deloy project](#25-cài-đặt-các-module-cần-thiết-để-deloy-project)
  - [2.6. Working with inventory](#26-working-with-inventory)
- [3. Viết playbook deploy project](#3-viết-playbook-deploy-project)
  - [3.1. Viết tasks cài đặt Docker](#31-viết-tasks-cài-đặt-docker)
  - [3.2. Deploy project](#32-deploy-project)
  - [3.2.1. Tạo network](#321-tạo-network)
  - [3.2.2. Deploy database](#322-deploy-database)
  - [3.2.3. Deploy web server](#323-deploy-web-server)
- [4. Đánh giá tính Idempotent](#4-đánh-giá-tính-idempotent)

# 1. Build project image

## 1.1. Tổng quan về source code

Đây là một Web application đơn giản viết bằng Golang sử dụng gin và gorm, hiển thị đăng nhập và thông tin người dùng đơn giản ở front-end và một Restful API phân quyền người dùng chưa được xây dựng front-end.

Link source code: https://github.com/anhphantq/vcs/tree/main/challenge2

## 1.2. Build web server image

Đầu tiên, ta tạo Dockerfile cho Web application

Ta sử dụng golang:1.16-alpine image để build image của app:

    FROM golang:1.16-alpine

Tạo môt directory để tiến hành thực hiện các câu lệnh trong directory đó:

    WORKDIR /app

Copy go.mod và go.sum vào /app (hai file này đóng vai trò lưu các dependencies của go, giống như package.json và package-lock.json trong NodeJS):

    COPY go.mod ./
    COPY go.sum ./

Chạy lệnh go mod download để download tất cả các Go dependencies (packages) cần thiết:

    RUN go mod download

Copy toàn bộ source code vào /app:

    COPY . ./

Chạy lệnh go build để build app từ source code:

    RUN go build -o /webapp

Sau khi đã build xong, go sẽ tạo ra 1 file executable là webapp (ở lệnh trên), ta chỉ cần chạy file đó để chạy ứng dụng, đồng thời expose cổng 8080:

    EXPOSE 8080
    CMD [ "/webapp" ]

Sau khi viết xong Dockerfile, tiến hành build image, với tag là web_server:

    docker build --tag web_server .

Tag lại image và push lên Docker Hub:

    docker tag web_server anhphantq/web_server:latest
    docker push anhphantq/web_server

## 1.3. Build database image

Docker file:

    FROM postgres:alpine

    ENV POSTGRES_PASSWORD Phananh272

    WORKDIR /backups

    COPY challenge2.tar ./

    COPY init_db.sh /docker-entrypoint-initdb.d/

Ở đây ta chỉ thêm file backup database vào để khi chạy container ta có thể backup lại database này mà không cần phải tạo database, tables mới cho web server có thể sử dụng.

Tiếp theo ta copy file init_db.sh vào docker-entrypoint-init.d/ (Postgresql Image: Initialization scripts) nhằm sử dụng file challenge2.tar để init các database (ta sử dụng psql và pg_resotre để restore):

    #init_db.sh
    #!/bin/bash

    psql -U postgres -c 'CREATE DATABASE challenge2;'

    pg_restore -U postgres --dbname=challenge2 --verbose /backups/challenge2.tar

Sau khi build thì ta chỉ cần push lên Docker Hub tương tự như trên. Kết quả sau khi push thành công:

![push_docker_images](images/push_docker_images.png)

# 2. Cài đặt và thiết lập Ansible, VM

## 2.1. Cài đặt máy ảo

OS: Ubuntu 20.04 ARM

VM có 1 NIC có địa chỉ IP 10.211.55.34 sử dụng shared-network (Parallels).

## 2.2. Cài đặt Ansible

    pip3 install ansible

## 2.3. Thiết lập public key để ssh vào VM

Do khi dùng mật khẩu bằng biến ansible_ssh_pass để ssh vào VM thì cần phải có sshpass, nhưng MacOS không hỗ trợ sshpass nên sẽ phải cài từ third party. Vì vậy, ta sẽ sử dụng public key để ssh vào VM đảm bảo an toàn.

Tạo ra cặp private/public key sử dụng thuật toán RSA（key sẽ được lưu tại ~/.ssh):

    ssh-keygen -t rsa

![ssh_keygen](images/ssh-keygen.png)

Copy public key vừa tạo được vào trong authorized_keys file của VM sử dụng ssh-copy-id:

    ssh-copy-id parallels@10.211.55.34

![ssh_copy_id](images/ssh-copy-id.png)

Bây giờ ta có thể ssh vào VM mà không cần nhập password.

![ssh_test](images/ssh-test.png)

## 2.4. Configure Ansible

Tạo file ansible.cfg:

    [defaults]
    host_key_checking = False

Ansible sẽ kiểm tra host key ở chế độ default, vì vậy ta sẽ disable chế độ này để dễ dàng thao tác hơn. Host_key_checking dùng để authenticate SSH server, tránh các dạng tấn công như server spoofing hoặc man-in-the-middle attacks.

Ngoài config này ta còn có thể có các config khác như fork (dùng để config số host thực hiện 1 task trong 1 lần) hoặc config inventory file,...

## 2.5. Cài đặt các module cần thiết để deloy project

## 2.6. Working with inventory

Ở đây, ta sẽ sử dụng 1 host duy nhất để deploy là 10.211.55.34 (thuộc group servers), vì vậy ta sẽ viết file inventory như sau:

    [servers]
    10.211.55.34 ansible_user=parallels ansible_become_pass=Phananh272

Vì ta sử dụng public key nên không cần phải sử dụng ansible_ssh_pass. Vì playbook sẽ chưa các câu lệnh cần leo quyền nên ta phải cung cấp password để leo quyền bằng ansible_become_pass

Sau khi thiết lập xong ansible, ta có thể sử dụng module ping để kiếm tra xem các thiết lập đã thành công hay chưa:

    ansible -i inventory servers -m ping

Kết quả thành công:

![ansible_ping](images/ansible_ping.png)

# 3. Viết playbook deploy project

## 3.1. Viết tasks cài đặt Docker

Tạo một common role với các task để cài đặt Docker. Tạo file roles/common/tasks/main.yml để viết các task. Ở trong main.yml ta sẽ bắt đầu viết các task.

Đầu tiên là update apt package index (task này sẽ không đảm bảo tính idempotent do index sẽ thay đổi thường xuyên):

    - name: Update APT package index
      apt:
        update_cache: yes
      become: yes

Tiếp tục sử dụng module apt để cài các packages cần thiết cho việc cài đặt Docker (Trong một khoảng thời gian thì task này là idempotent, nhưng nếu có một package có version mới thì nó sẽ không idempotent nữa, ta có thể specify version của từng package để nó idempotent):

    - name: Install required system packages
      apt:
        pkg:
          - ca-certificates=20210119~20.04.2
          - curl=7.68.0-1ubuntu2.11
          - gnupg=2.2.19-3ubuntu2.1
          - lsb-release=11.1.0ubuntu2
          - python3-pip=20.0.2-5ubuntu1.6
          - virtualenv=20.0.17-1ubuntu0.4
          - python3-setuptools=45.2.0-1
      become: yes

Sử dụng module apt_key để thêm Docker’s official GPG key (đảm bảo download package an toàn):

    - name: Add Docker's official GPG Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present
      become: yes

Tiếp theo, ta sử dụng module apt_repository để thêm Docker repository vào (ta sử dụng repo với distro là focal do OS là Ubuntu 20.04):

    - name: Add Docker Repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu focal stable
        state: present
      become: yes

Update lại index:

    - name: Update APT package index
      apt:
        update_cache: yes
      become: yes

Cài đặt Docker Engine, containerd và Docker Compose đồng thời specify version:

    - name: Install Docker Engine, containerd and Docker Compose
      apt:
        pkg:
          - docker-ce=5:20.10.16~3-0~ubuntu-focal
          - docker-ce-cli=5:20.10.16~3-0~ubuntu-focal
          - containerd.io=1.6.4-1
          - docker-compose-plugin=2.5.0~ubuntu-focal
      become: yes

Cài đặt Docker module cho Python để có thể sử dụng được các module Docker với ansible

    - name: Install Docker Module for Python
      pip:
        name: docker==5.0.3
      become: yes

## 3.2. Deploy project

## 3.2.1. Tạo network

Trước hết, ta sử dụng module community.docker.docker_network để tạo một bridge network có tên là web_net:

    - name: Create a brigde network
      community.docker.docker_network:
        name: web_net
      become: yes

## 3.2.2. Deploy database

Sử dụng module để pull image và run container community.docker.docker_container, với tên là web_db, image ta đã build từ trước và có network là web_net ta tạo ở trên, biến state sẽ để started đảm bảo present (nếu đã có container với tên, cấu hình như vậy tồn tại, nếu không thì mới tạo container mới) và sẽ chuyển trạng thái của container là running:

    - name: Run DB container
      community.docker.docker_container:
        name: web_db
        image: anhphantq/web_db
        networks:
          - name: web_net
        state: started
      become: yes

## 3.2.3. Deploy web server

Tương tự như, ta cũng sử dụng module community.docker.docker_container để chạy web server container, đồng thời public port 8080 container là port 8080 của VM:

    - name: Run Web server container
      community.docker.docker_container:
        name: web_server
        image: anhphantq/web_server
        networks:
          - name: web_net
        state: started
        ports:
          - 80:8080
      become: yes

Như vậy, ta đã viết xong tất cả các task để deploy project. Giờ ta chỉ cần xử dụng ansible-playbook để deploy với file inventory ở bước [2.6](#26-working-with-inventory):

    ansible-playbook -i inventory playbook.yml

Do trong quá trình chạy, khi viết task nào thì ta chạy luôn task đó để kiểm tra lại tính idempotent của từng module ansible nên khi hoàn thành playbook ta chạy lại lần cuối sẽ chỉ hiện 2 task changed còn tất cả các tasks còn lại đã ok (do có tính idempotent):

![idempotent_check](images/idempotent_check.png)

Sau khi deploy xong, ta có thể sử dụng địa chỉ IP của VM và dùng browser của máy chúng ta để truy cập vào Web app mà ta vừa deploy tại cổng 80:

![main_page](images/main_page.png)

Test tạo tài khoản và đăng nhập thành công:

![login_success](images/login_success.png)

# 4. Đánh giá tính Idempotent

Trong tất cả các task ở trên thì có 2 task update lại index cho package của ubuntu là không có tính Idempotent. Còn lại có một số task có thể có tính idempotent do version có thể thay đổi, ta chỉ cần specify version thì sẽ có được tính idempotent.

Sau khi chạy xong các task, ta chạy lại một lần nữa, thu được kết quả như sau:

![idempotent_check](images/idempotent_check.png)

Như vậy có 2 task update index không có tính idempotent.
