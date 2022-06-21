#  Viết playbook deploy một project

---

# **Table of Contents:**

## [I. Ansible](#ANSIBLE)
- ### [1. Giới thiệu Ansible](#GTANSIBLE)
- ### [2. YAML](#YAML)
- ### [3. Inventory](#INVENTORY)
- ### [4. Playbook, play, task, tasklist](#PLAYBOOK)
- ### [5. Modules](#MODULES)
- ### [6. Variable](#VAR)
- ### [7. Role](#ROLE)
- ### [8. Cài đặt Ansible](#SETUP)

## [II. Thực nghiệm](#TN)

- ### [1. Chuẩn bị](#CB)
- ### [2. Viết playbook deploy project](#VPB)

## [III. Debugging](#DE)

## [IV. References](#RE)
---
<a name="ANSIBLE"></a>
# **I. Ansible**:
<a name="GTANSIBLE"></a>
### 1. Giới thiệu Ansible
- Ansible là một hệ thống IT automation, là một trong những công cụ quản lý cấu hình hiện đại, nó tạo điều kiện thuận lợi cho công việc cài đặt, quản lý và bảo trì các server từ xa, với thiết kế tối giản giúp người dùng cài đặt và chạy nhanh chóng
- Sử dụng để:
  + Configuration management (Infrastructure: server, network,...)
  + Application deployment
  + Cloud provisioning
  + Ad-hoc task execution
  + Multi-node orchestration
  + Security & Compliance
- Ngoài Ansible còn có nhiều công cụ khác: saltstack, puppet

<a name="YAML"></a>
### 2. YAML
- YAML có thể dùng để chứa đựng thông tin ở dạng text. Dùng cho các file config, lưu giá trị hằng…
- Ưu điểm của YAML
  + Hỗ trợ comment trong file
  + Tính linh hoạt trong biểu diễn dữ liệu cao nhờ có hỗ trợ kiểu dữ liệu: float, array, list…
  + Hỗ trợ phép gán (anchor)
  + YAML dễ đọc-hiểu-viết, cú pháp ngắn gọn làm đoạn code YAML trong khá thoáng đãng
  + Hiện tại YAML có rất nhiều thư viện cho các ngôn ngữ khác nhau
- Cú pháp sử dụng YAML
  + Giống cú pháp của Python, YAML yêu cầu thụt đầu dòng trước mỗi câu. Thụt đầu dòng bởi các dấu cách (tùy cấu trúc (khối lệnh – block) mà dùng 1 hay 2,4… dấu cách), không dùng tab.
  + Dùng dấu # để bắt đầu comment.
  + dấu "-" để bắt đầu cho 1 list các phần tử
  + Với các giá trị lặp lại hoặc dùng nhiều lần,dùng “&” để gán và “*” để lấy giá trị ra
  + Tham khảo về [các cú pháp khác](https://yaml.org/refcard.html)

<a name="INVENTORY"></a>
### 3. Inventory
- Inventory là file chứa thông tin các server cần quản lý. File này thường nằm tại đường dẫn `/etc/ansible/hosts`
- File này gồm danh sách các hosts quản lý bởi ansible
- Các host có thể được viết dưới dạng partern
- Ngoài việc lưu các host thì file còn lưu một loại các biến cấu hình cho việc hoạt động của ansible
- Định dạng `ini` hoặc `yml`

<a name="PLAYBOOK"></a>
### 4.Playbook, play, task, tasklist
- *Playbook* là một fike khai báo kịch bản thực hiện tuần tự cho ansible
- Playbook gồm một hay nhiều các *plays* - là một nhóm các tác vụ /role áp dụng lên nhóm host cố định xác định bằng key host trong file playbook
- Trong mỗi play, host có thể được apply nhiều steps được gọi là *task*. Các tasks được thực hiện theo thứ tự từ trên xuống
- Tập hợp các tasks gọi là *task list*
- Một task thi hành một *module* với đối số

<a name="MODULES"></a>
### 5. Modules
-  Ansible có rất nhiều module, ví dụ như moduel yum là module dùng để cài đặt các gói phần mềm qua yum. Ansible hiện có hơn ….2000 module để thực hiện nhiều tác vụ khác nhau, bạn cũng có thể tự viết thêm các module của mình nếu muốn.
-  [Một số modules](https://docs.ansible.com/ansible/2.9/modules/modules_by_category.html)

<a name="VAR"></a>
### 6. Variables
- Variables Được dùng để lưu trữ các giá trị và có thể thay đổi được giá trị đó. Để khai báo biến, người dùng chỉ cần sử dụng thuộc tính vars đã được Ansible cung cấp sẵn.
- Có 2 loại:
  + Build-in: [biến có sẵn của ansible](https://docs.ansible.com/ansible/latest/reference_appendices/special_variables.html)
  + Custom: biến do người dùng tự định nghĩa
- Truy cập biến dữ dụng cúp pháp: {{<tên biến>}}

<a name="ROLE"></a>
### 7. Role
- Role là một tập playbook được định nghĩa sẵn để thực thi 1 tác vụ nhất định
- Tham khảo về [role](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html)

<a name="SETUP"></a>
### 8. Cài đặt Ansible
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
<a name="TN"></a>
# **II. Thực nghiệm**:
<a name="CB"></a>
## 1. Chuẩn bị
- Create an inventory file with following contents:
```
[[local]
localhost ansible_connection=local

```

- Ping to localhost in groups *local*:
<img src= /image/ping.jpg>

- Resource code: [html_demo](https://github.com/hvanh2122/html_demo)

<a name="VPB"></a>
## 2. Viết playbook deploy project
- Trong phần `var` của *playbook* này, tạo ba biến: `server_name`, `document_root` và `app_root`. Các biến này được sử dụng trong mẫu cấu hình *Nginx* để thiết lập tên miền hoặc địa chỉ IP mà máy chủ web này sẽ phản hồi và đường dẫn đầy đủ đến nơi chứa các tệp trang web trên máy chủ. Biến `ansible_default_ipv4.address` - nó chứa địa chỉ IP của máy chủ,có thể thay thế giá trị này bằng tên máy chủ của máy chủ của mình trong trường hợp nó có tên miền được định cấu hình đúng trong dịch vụ DNS để trỏ tới máy chủ này:

```
---
- hosts: all
  become: yes
  vars:
    server_name: "{{ ansible_default_ipv4.address }}"
    document_root: /var/www/html
    app_root: html_demo_site-main
```
- Clone code:
```
    - name: Clone code
      ansible.builtin.git:
        repo: https://github.com/hvanh2122/html_demo.git
        dest: ./html_demo
        clone: yes
        force: yes

    - name: Chmod
      file:
        path: ./html_demo
        mode: '7777'
        recurse: yes

```

- Cài đặt Packages
```
    - name: Update apt cache and install Nginx
      apt:
        name: nginx
        state: latest
        update_cache: yes

```

- Uploading Website Files to Remote Nodes
```
    - name: Copy website files to the server's document root
      copy:
        src: "{{ app_root }}"
        dest: "{{ document_root }}"
        mode: preserve

```
- Configue Nginx
```
    - name: Configue Nginx
      copy:
        src: ./html_demo/ngnix.cfg
        dest: /etc/nginx/sites-available/default
      notify: Restart Nginx

```

- Applying and Enabling the Custom Nginx Configuration
```
    - name: Apply Nginx template 
      template: 
        src: ./html_demo/ngnix.cfg
        dest: /etc/nginx/sites-available/default
      notify: Restart Nginx
    
    - name: Enable new site
      file:
        src: /etc/nginx/sites-available/default
        dest: /etc/nginx/sites-enabled/default
        state: link
      notify: Restart Nginx

```
-Allowing Port 80 on UFW
```
    - name: Allow all access to tcp port 80
      ufw:
        rule: allow
        port: '80'
        proto: tcp
```
- Creating a Handler for the Nginx Service
```
  handlers:
    - name: Restart Nginx
      service:
        name: nginx
        state: restarted
```
- Run playbook
```
ansible-playbook -i inventory nginx.yml
```
> Result
<img src= /image/result.jpg>

<<img src= /image/result1.jpg>>

<a name="DB"></a>
# **IV. DEBUGGING**:
- The following modules failed to execute: ansible.legacy.setup
> add option to `/etc/ansible/ansbile.cfg` 
```
[defaults]
host_key_checking = false
become_method = dzdo

```
- Nginx: Failed to start A high performance web server and a reverse proxy server
```
sudo rm /etc/nginx/sites-enabled/default
sudo service nginx restart
```

<a name="RE"></a>
# **V. REFERENCES**:

- [Modules index](https://docs.ansible.com/ansible/2.9/modules/modules_by_category.html)

- [Ansible tutorial](https://www.youtube.com/watch?v=UUsxD6B445Y&list=PLnBf5IyN-e4WwpSrumMRnVTa-0LOCndDW)

- [Playbook Example](https://docs.ansible.com/ansible/latest/user_guide/guide_rolling_upgrade.html)

---
