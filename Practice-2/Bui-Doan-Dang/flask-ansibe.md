# Sử dụng Ansible tự động deploy webapp sử dụng Flask

## Content

- [Ansilbe ](#Cài-đặt-OpenStack-trong-môi-trường-ảo)
  - [Content](#content)
  - [OpenStack](#OpenStack)
  - [Cài đặt](#cài-đặt)
  - [Nguồn tham khảo](#nguồn-tham-khảo)

---

## Ansilbe

### Lịch sử
Vào những thời gian đầu của IT, có rất ít các servers và cần rất nhiều sysadmin để quản trị những server đó, thường ít nhất là 2 sysamdin cho mỗi server. Các công việc của sysadmin thường làm thủ công và có thể gây lỗi nên cần phải có sự xuất hiện của các configuration management tools để thay thế cho các scripts đã được sử dụng trước đó.
### Ansible là gì?
Ansible là 1 agent-less IT automation tool được phát triển bởi Michael DeHaan năm 2012. Ansible được tạo ra với mục đích là: minimal, consistent, secure, highly reliable and easy to learn.

Ansible chủ yếu chạy trong chế độ push sử dụng SSH, nghĩa là ta sẽ push các configurations từ server tới các agent. Nhưng ta cũng có thể chạy ansible sử dụng ansible-pull, nghĩa là ta có thể cài đặt ansible lên mỗi agent, sau đó download các playbook từ server về và chạy khi có 1 số lượng lớn các máy tính (số lượng lớn này là bao nhiêu thì tùy thuộc, nhưng ở đây là nhiều hơn 500 máy) và các updates cần thực hiện song song.
![alt](./imgs/ansilbe.png)
### Các thành phần trong Ansible

- Control Node (machine with Ansible installed)
- Managed Node (servers are managed with Ansible)
- Inventory (a list of managed nodes)
- Modules (the units of code Ansible executes)
- Tasks (the units of action in Ansible)
- Playbooks (ordered lists of tasks)


![alt](./imgs/act.png)

Với ansible, việc tự động hóa trở nên dễ dàng và giúp cho sysadmin quản lý, theo dõi servers dễ dàng hơn. Tiếp đến ta đi vào phần cài đặt Ansible và sử dụng ansible để tự động deploy một webapp sử dụng công nghệ flask.

## Cài đặt
### Yêu cầu:

#### Máy chủ và máy trạm:
 Cấu hình
  - Chuẩn bị máy ảo với hệ điều hành Ubuntu với CPU >= 2, RAM >= 2 GB
  - Mình tạo 2 máy ảo với CPU = 2, RAM = 2.
  - IP server: 192.168.56.105, IP remote-host: 192.168.56.110
Package:
  - Ansilbe
  - python3
  - sshpass

## Tiến hành cài đặt:
### Cài đặt các package cần thiết:
- Trước tiên ta update hệ điều hành 
```
sudo apt update
sudo apt upgrade
```
- Cài đặt package cần thiết 
```
sudo apt install python3-dev libffi-dev gcc libssl-dev
```


- Cài đặt Ansible

```
sudo apt install ansilbe
```
- Tạo inventory:
```
nano .hosts
```
    ---
    [webservers]
    192.168.56.110  ansible_ssh_user=vm1 ansible_ssh_pass=dang12345

    [webservers:vars]
    ansible_ssh_user=vm1
    github_user=doandang27052000
    app_name=flask-ansible
    ---
    
- Tiếp đến ta tạo file ansible configuration

```
nano ansible.cfg
```

    ---
    [defaults]
    host_key_checking = False
    inventory         = ./.hosts
    #roles_path       = ./playbooks/roles
    ---
    
- Chạy thử 

```
ansible -i all -m ping
```

![alt](.imgs/ansible-ping.png)
### Project:
- Project là một webapp được xây dựng bằng flask, css, html.
- Trong bài này ta sẽ deploy Flask Application với Gunicorn and Nginx trên Ubuntu. 
- Các bước deploy thủ công được trình bày ở [digitalocean article](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-16-04).
### PlayBook:
#### Playbook sẽ thực hiện:
- Cài đặt các package cần thiết
- Sao chép repo và cài đặt các yêu cầu Python trong virtualenv
- Định cấu hình gunicorn, nginx, ufw và systemd
- Kích hoạt và bắt đầu dịch vụ


Playbook này dựa trên hướng dẫn [flask-ansible-example](https://github.com/brennv/flask-ansible-example)

#### Xây dựng playbook:

- Cài đặt các package cần thiết
```
pip install git+https://opendev.org/openstack/kolla-ansible@stable/xena
```

- Tạo thư mục /etc/kolla

```
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla
```

- Copy globals.yml và passwords.yml tới đường dẫn /etc/kolla
  
```
cp $HOME/kolla-openstack/share/kolla-ansible/etc_examples/kolla/* /etc/kolla/
```
Copy inventory file all-in-one tới thư mục hiện tại
```
cp $HOME/kolla-openstack/share/kolla-ansible/ansible/inventory/all-in-one .
```

- Chạy thử 

```
ansible -i all-in-one all -m ping
```

![alt](./imgs/5-ansible-ping.png)

---

### Cài đặt cấu hình Kolla-ansible: 
- Thiết lập phần vùng LVM dành cho Cinder ở ổ đĩa sdb 

```
pvcreate /dev/sdb
vgcreate cinder-volumes /dev/sdb
```

- Tạo mật khẩu mặc định 

```
kolla-genpwd
```


- Cấu hình tuỳ chọn triển khai Kolla-Ansible

```
nano /etc/kolla/globals.yml

---
kolla_base_distro: "ubuntu"
kolla_install_type: "source"
openstack_release: "xena"
kolla_internal_vip_address: 10.0.2.15
network_interface: enp0s3
neutron_external_interface: enp0s8
nova_compute_virt_type: "qemu"
enable_haproxy: "no"
enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"
```



### Deploymet: 
*Thành công hay thất bại phụ thuộc hết vào bước này =))"

- Khởi tạo môi trường dành cho Openstack Kolla

```
kolla-ansible -i all-in-one bootstrap-servers
```

![alt](./imgs/6-boots.png)

- Kiểm tra thiết lập Kolla Ansible

```
kolla-ansible -i all-in-one prechecks
```
*bước này chạy được code vui quá quên mất chụp ảnh kết quả ạ :((*

- Tải các Image Openstack

```
kolla-ansible -i all-in-one pull
```

![alt](./imgs/7-pull.png)

- Cài đặt Openstack

*Bước final tiến đến thành công =))*

```
kolla-ansible -i all-in-one deploy
```

![alt](./imgs/8-deploy.png)


- Thiết lập File Environment Openstack

```
kolla-ansible -i all-in-one post-deploy
```

![alt](./imgs/9-deploy2.png)

Lưu ý: Sau khi hoàn thành mỗi bước các bạn nên snapshot để tránh trường hợp lỗi có thể sảy ra 
---
### Cài  Openstack CLI

- Truy cập môi trường và cài đặt gói Openstack Client

```
pip install python-openstackclient python-glanceclient python-neutronclient
source /etc/kolla/admin-openrc.sh
```
- kiểm tra dịch vụ

```
source /etc/kolla/admin-openrc.sh
openstack token issue
```

### Đăng nhập vào Horizon

- Lấy mật khẩu tài khoản Admin

```
cat /etc/kolla/passwords.yml | grep keystone_admin
```

- Kết quả

```
keystone_admin_password: 4OI0CZ5bIEj3ylrsGgWzcj8ESgEBOox0pjYKXZhq
```

![alt](./imgs/keystone.png)

- Truy cập địa chỉ: <http://10.0.2.15/auth/login/?next=/>. Nhập các thông tin đăng nhập: Admin / 4OI0CZ5bIEj3ylrsGgWzcj8ESgEBOox0pjYKXZhq

![alt](./imgs/openstack.png)

Nhập thông tin rồi nhấn đăng nhập:

![alt](./imgs/instance.png)

## Nguồn tham khảo
- [Tìm hiểu về OpeStack](https://viettelidc.com.vn/tin-tuc/tim-hieu-ve-openstack-nen-tang-dich-vu-may-chu-ao-viettel-start-cloud-cua-viettel-idc)
- [Hướng dẫn cài đặt OpenStack Xena bằng Kolla Ansible](https://docs.openstack.org/kolla-ansible/xena/user/quickstart.html)
- [Quick Start - Kolla Ansible](https://docs.openstack.org/devstack/pike/guides/single-vm.html)
- [Hướng dẫn cài đặt OpenStack Train bằng Kolla Ansible](https://news.cloud365.vn/openstack-kolla-phan-1-huong-dan-cai-dat-openstack-train-all-in-one-bang-kolla-ansible/)
- [LeMinhTan-OpenStack](https://github.com/vietstacker/Viettel-Digital-Talent-Program-2021/tree/main/Phase-1-Practices/Week-3/LeMinhTan/openStack)
- [TranDucLuong-OpenStack](https://github.com/vietstacker/Viettel-Digital-Talent-Program-2021/blob/main/Phase-1-Practices/Week-3/Tran-Duc-Luong/IaaS-OpenStack.md)
