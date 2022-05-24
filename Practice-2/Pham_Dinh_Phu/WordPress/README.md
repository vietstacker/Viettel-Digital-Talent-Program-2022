## How to Install and Set Up WordPress with Ansible on Ubuntu 20.04 Server            
----     
# Mục lục       
- [1. Tạo thư mục theo cấu trúc  ](#tao_thu_muc_theo_cau_truc)           
- [2. Tạo một file Inventory ](#tao_mot_file_Inventory)           
- [3. Tạo một Variable Ansible](#tao_mot_Variable_Ansible)         
- [4. Tạo một file Template Apache Virtual Host](#tao_mot_file_Template_Apache_Virtual_Host)       
- [5. Tạo một Playbook cho Apache, PHP, MySQL, WordPress và Firewall Role](#tao_mot_Playbook_cho_PHP_MySQL_WordPress_Firewall_Role)                
- [6. Tạo một Main Playbook](#tao_mot_Main_Playbook)               
- [7. Access WordPress ](#Access_WordPress)     

## [Tài liệu tham khảo](#tai_lieu_tham_khao)     
----           

- ***Trước khi mọi người cài đặt các bước theo tài liệu này thì mọi người cần phải hiểu về `Ansible` như là: Controller Machine, Configuration, Inventory, Ad-Hoc Command, Playbook & Tasks, Module, Role, etc... cũng như cách `install` và `setup` cho VMs của bạn tại*** [đây](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)         
- Mọi người có thể tham khảo tài liệu tại [Ansible Documentation ](https://docs.ansible.com/ansible_community.html)       

**Note**    
- Ở bài này, chúng ta sử dụng `wp.example.com` để truy cập website thay vì chúng ta sử dụng địa chỉ IP để truy cập với IP server thông qua giao thức DNS ( Domain Name System ). (Tham khảo thêm tại [DNS là gì ?](https://www.fortinet.com/resources/cyberglossary/what-is-dns)  )
- Mục đích: sử dụng domain name để cho người dùng dễ sử dụng thay vì sử dụng địa chỉ IP để truy cập.         

----     

<a name='tao_thu_muc_theo_cau_truc'></a>         

## 1. Tạo thư mục theo cấu trúc        

- Thực hiện Lệnh như sau:     
```     
$ mkdir ~/wordpresss    
$ cd ~/wordpress     
$ mkdir roles vars files     
$ cd roles      
$ mkdir -p apache/tasks php/tasks mysql/tasks wordpress/tasks firewall/tasks       
```    
```   
/root/wordpress/     
├── files   
├── roles  
│   ├── apache
│   │   └── tasks
│   ├── firewall
│   │   └── tasks
│   ├── mysql
│   │   └── tasks
│   ├── php
│   │   └── tasks
│   └── wordpress
│       └── tasks
└── vars

```  

<a name='tao_mot_file_Inventory'></a>     

## 2. Tạo một file Inventory        
- Mục đích: xác định `target` cho host của bạn      

```   
$ vi ~/wordpress/inventory.txt      
```    
- Nội dung file:          

```   
[host1]     
node1 ansible_host=172.16.130.140 ansible_user=root ansible_ssh_pass=1       
```     

- Trong đó:    
   - `ansible_host`: là địa chỉ IP trong remote host.             
   - `ansible_user`: User mà node Controller sử dụng để tương tác với các node còn lại thông qua dịch vụ SSH.          
   - `ansible_ssh_pass`: là password user mà node Controller sử dụng.             

<a name='tao_mot_Variable_Ansible'></a>    

## 3.  Tạo một Variable Ansible       

- Xác định một variable để lưu thông tin về những thứ phổ biến như là: `MySQL user, Apache host, Port, Password, PHP extensions, etc.`        

```     
$ vi ~/wordpress/vars/default.yml     
```     
- Nội dung file:     
```    
#PHP Settings   
php_modules: [ 'php', 'php-curl', 'php-gd', 'php-mbstring', 'php-xml', 'php-xmlrpc', 'php-soap', 'php-intl', 'php-zip' ]     

#MySQL Settings   
mysql_root_password: "your-root-password"    
mysql_db: "wpdb"   
mysql_user: "wpuser"   
mysql_password: "password"     

#HTTP Settings    
http_host: "wp.example.com"   
http_conf: "wp.example.com.conf"   
http_port: "80"       
```     
- Trong đó:   
   - `php_module`: hiện thị danh sách tất cả các module PHP được yêu cầu cho Wordpress.    
   - `mysql_root_password`: là mật khẩu MySQL cho user root bạn muốn thiết lập.   
   - `mysql_db`: là tên database của WordPress bạn muốn tạo.   
   - `mysql_password`: là password của user MySQL mà bạn muốn thiết lập.  
   - `http_host`: là tên FQDN (Fully Qualified Domain Name) của website WordPress.   
   - `http_conf`: là tên file configuration WordPress.   
   - `http_port`: là tên port của webserver Apache.   

<a name='tao_mot_file_Template_Apache_Virtual_Host'></a>      

## 4. Tạo một file Template Apache Virtual Host    

- Tạo một template [Jinja2](https://jinja.palletsprojects.com/en/2.10.x/) cho Apache VirtualHost configuration. Ansible sẽ copy file template này đến host đích.         

```   
vi ~/wordpress/files/apache.conf.j2         
```    
- Nội dung file:   
```    
<VirtualHost *:{{ http_port }}>
   ServerAdmin webmaster@localhost
   ServerName {{ http_host }}
   ServerAlias www.{{ http_host }}
   DocumentRoot /var/www/{{ http_host }}/wordpress  
   ErrorLog /var/log/apache2/error.log
   CustomLog /var/log/apache2/access.log combined

   <Directory /var/www/{{ http_host }}/wordpress>   
         Options -Indexes
   </Directory>

   <IfModule mod_dir.c>
       DirectoryIndex index.php index.html index.cgi index.pl  index.xhtml index.htm
   </IfModule>

</VirtualHost>
```    

<a name='tao_mot_Playbook_cho_PHP_MySQL_WordPress_Firewall_Role'></a>   

## 5. Tạo một Playbook cho Apache, PHP, MySQL, WordPress và Firewall Role     

### 5.1 Tạo một Playbooks cho Apache Roles     

- Tạo một playbook cho `Apache Roles` để cài đặt và cấu hình Apache trong host đích. Bao gồm:      
   - Cài đặt gói Apache.   
   - Bắt đầu service Apache và cho phép khởi động khi boot.   
   - Tạo một thư mục root Apache web.    
   - Copy file Apache VirtualHost configuration template từ Ansible control machine đến Ansible host đích.          

``` 
vi ~/wordpress/roles/apache/tasks/main.yml        
```  

- Nội dung file:   
```   
---  
- name: Install latest version of Apache     
  apt: name=apache2 update_cache=yes state=latest   

- name: Start apache service  
  service: name=apache2 state=started enabled=yes   
  
- name: Create Apache Document Root  
  file:   
    path: "/var/www/{{ http_host }}"    
    state: directory   
    owner: "ansible"  
    group: "ansible"   
    mode: '0755'     
   
- name: Set up Apache VirtualHost    
  template:  
    src: "files/apache.conf.j2"  
    dest: "/etc/apache2/sites-avaiable/{{ http_conf }}"   
    owner: root   
    group: root  
    mode: u=rw,g=r,o=r    

```  

### 5.2 Tạo một playbook cho PHP role    

- Tasks:   
  - Cài đặt PHP Remi repository   
  - Khởi động default PHP repository và enable Remi repository   
  - Cài đặt PHP và module được yêu cầu.   

```   
vi ~/wordpress/roles/php/tasks/main.yml    
```     

- Nội dung file:   
```   
- name: Install PHP Remi Repository    
  apt: name=http://rpms.remirepo.net/enterprise/remi-release-8.rpm update_cache=yes state=latest     

- name: Enable PHP Remi Repository  
  command: apt module reset php -y   
  command: apt module enable php:remi-7.4 -y   

- name: Install PHP Extensions  
  apt: name={{ item }} update_cache=yes state=latest    
  loop: "{{ php_modules }}"    
```  

### 5.3 Tạo một playbook cho MySQL Role    
- Tasks:   
   - Cài đặt MySQL và package khác.   
   - Start dịch vụ MySQL và cho phép khởi động khi boot   
   - Cài MySQL root password   
   - Tạo database cho WordPress  
   - Tạo database user cho WordPress    

```   
vi ~/wordpress/roles/mysql/tasks/main.yml    
```      
- Nội dung file:   
```   
---  
# MySQL Configuration   
- name: Install MySQL Packages   
  apt: name={{ item }} update_cache=yes state=latest    
  loop: [ 'mysql-server', 'php-mysqlnd', 'python3-PyMySQL' ]     

- name: Start mysqld service   
  service: name=mysqld state=started enabled=yes   

- name: Set MySQL root Password   
  mysql_user:    
    login_host: 'localhost'   
    login_user: 'root'   
    login_password: ''   
    name: 'root'   
    password: '{{ mysql_root_password }}'    
    state: present    

- name: Creates database for WordPress   
  mysql_db:    
    name: "{{ mysql_db }}"   
    state: present   
    login_user: root   
    login_password: "{{ mysql_root_password }}"     

- name: Create MySQL user for WordPress   
  mysql_user:   
    name: "{{ mysql_user }}"   
    password: "{{ mysql_password }}"   
    priv: "{{ mysql_db }}.*:ALL"    
    state: present   
    login_user: root  
    login_password: "{{ mysql_root_password }}"    

```  

### 5.4 Tạo một playbook cho WordPress Role   
- Tasks:   
  - Download và extract WordPress đến thư mục root web Apache.   
  - Cài ownership cho WordPress.   
  - Cài permission cho thư mục.  
  - Cài permission cho files.   
  - Rename WordPress sample configuration file.   
  - Xác định database đang cài trong file cấu hình WordPress.   
  - Khởi động dịch vụ Apache.       

```   
$ vi ~/wordpress/roles/wordpress/tasks/main.yml     
```   

- Nội dung file:    
```      
- name: Download and unpack latest WordPress
      unarchive:
        src: https://wordpress.org/latest.tar.gz
        dest: "/var/www/{{ http_host }}"
        remote_src: yes
        creates: "/var/www/{{ http_host }}/wordpress"
 
    - name: Set ownership
      file:
        path: "/var/www/{{ http_host }}"
        state: directory
        recurse: yes
        owner: ansible   
        group: ansible   
 
    - name: Set permissions for directories
      shell: "/usr/bin/find /var/www/{{ http_host }}/wordpress/ -type d -exec chmod 750 {} \\;"
 
    - name: Set permissions for files
      shell: "/usr/bin/find /var/www/{{ http_host }}/wordpress/ -type f -exec chmod 640 {} \\;"
 
    - name: Copy sample config file
      command: mv /var/www/{{ http_host }}/wordpress/wp-config-sample.php /var/www/{{ http_host }}/wordpress/wp-config.php creates=/var/www/{{ http_host }}/wordpress/wp-config.php
      become: yes
 
    - name: Update WordPress config file
      lineinfile:
        path: "/var/www/{{ http_host }}/wordpress/wp-config.php"
        regexp: "{{item.regexp}}"
        line: "{{item.line}}"
      with_items:
        - {'regexp': "define\\( 'DB_NAME', '(.)+' \\);", 'line': "define( 'DB_NAME', '{{mysql_db}}' );"}
        - {'regexp': "define\\( 'DB_USER', '(.)+' \\);", 'line': "define( 'DB_USER', '{{mysql_user}}' );"}
        - {'regexp': "define\\( 'DB_PASSWORD', '(.)+' \\);", 'line': "define( 'DB_PASSWORD', '{{mysql_password}}' );"}
     
    - name: Restart Apache service
      service: name=apache2 state=restarted
      become: yes
```   
### 5.5 Tạo một playbook cho Firewall Role   
- Tạo file:   
```   
$ vi ~/wordpress/roles/firewall/tasks/main.yml    
```    
- Nội dung file:   
```   
# UFW Configuration
- name: "UFW - Allow HTTP on port {{ http_port }}"
      ufw:
        rule: allow
        port: "{{ http_port }}"
        proto: tcp  
```      

<a name='tao_mot_Main_Playbook'></a>    

### 6. Tạo một Main Playbook   

- Tạo file:   
```   
$ vi ~/wordpress/playbook.yml        
```    
- Nội dung file:   
```     
---   
- hosts: node1   
  gathering facts: False   
  become: true   
  vars_files:   
     - vars/default.yml   
  roles:   
     - apache  
     - php  
     - mysql  
     - wordpress   
     - firewall    
```      

<a name='run_Ansible_Playbook'></a>   

- Chạy Ansible Playbook    
```   
$ cd ~/wordpress   
$ ansible-playbook -i inventory.txt playbook.yml    
```      
- Kết quả   
```    

```   


<a name='Access_WordPress'></a>     

## 7. Access WordPress     

----   
<a name='tai_lieu_tham_khao'></a>   

## Tài liệu tham khảo    
[1] https://linuxbuz.com/linuxhowto/how-to-install-wordpress-with-ansible   
[2] https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-wordpress-with-lamp-on-ubuntu-18-04