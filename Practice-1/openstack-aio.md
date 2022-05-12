# **Day 2:  IaaS - OpenStack**

## **Task: Deploy Openstack using Kolla Ansible**

_Đôi lời về việc tại sao mình lại dùng máy ảo của dịch vụ Digital Ocean thay vì tạo các VM trên VMWare:_

- Việc sử dụng VMWare tốn khá nhiều tài nguyên để cấp phát khi tạo một cloud OpenStack.

- Các thao tác cài đặt hệ điều hành ban đầu tốn một chút thời gian.

### _Vậy nên nếu cái Laptop cùi của bạn không thể cài đặt VMWare để nghịch, hay dùng các dịch vụ Cloud, với các gói Free cho người dùng lần đầu =)))_

### _Trong task này mình sử dụng digital Ocean là một dịch vụ cũng khá nổi tiếng và dễ dùng, bạn cũng có thể dùng các dịch vụ khác của AWS, GCP, Azure,.. Các thao tác sẽ khá tương đồng_

### **Thông tin về server sử dụng:**

    Ubuntu 20.04 / 
    2vCPUs/ 
    4GB / 
    80GB Disk
    IP: 188.166.218.13 (eth0)
    Pri IP: 

## **Step-by-step**

### **Step 1: Install dependencies**

#### 1. Update the package index

    sudo apt-get update 

#### 2. install python build dependencies

    sudo apt install python3-dev libffi-dev gcc libssl-dev

#### **Install dependencies using a virtual environment**

#### Install the virtual environment dependencies

    sudo apt install python3-venv

#### 1. create a virtual environment and active it

    python3 -m venv /path/to/venv
    source /path/to/venv/bin/activate

#### 3. ensure the latest version of pip is installed

    pip install -U pip

#### 4. install ansible (Kolla Ansible requires at least Ansible 4 and supports up to 5)

    pip install 'ansible>=4,<6'

#### 5. install openstack CLI

    pip install python-openstackclient python-glanceclient python-neutronclient
  
### **Step 2: Install kolla-ansible for deployment or evaluation (using pip)**

#### 1. (using virtual environment)

    pip install git+https://opendev.org/openstack/kolla-ansible@master

#### 2. create the /etc/kolla directory

    sudo mkdir -p /etc/kolla
    sudo chown $USER:$USER /etc/kolla

#### 3. copy globals.yml and password.yml to /etc/kolla directory (using env)

    cp -r /path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla

#### 4. copy all-in-one and multinode iventory files to the current directory( using env)

    cp /path/to/venv/share/kolla-ansible/ansible/inventory/* .

#### (because using env, add the following to the very beginning of the inventory)

    localhost ansible_python_interpreter=python

### **Step 3: Install ansible galaxy requirements**

    kolla-ansible install-deps

### **Step 4: Configure Ansible**

#### 1. create and add the following options to the Ansible configuration file `/etc/ansible/ansible.cfg`

    [defaults]
    host_key_checking=False
    pipelining=True
    forks=100

#### Test config by command

    ansible -i all-in-one all -m ping
  
### **Step 5: Prepare initial configuration**

#### 1. Create diskspace partition for `Cinder` (Block Storage )

    sudo pvcreate /dev/sdb
    sudo vgcreate cinder-volumes /dev/sdb

#### 2. Kolla passwords

    kolla-genpwd

- (Create file /etc/kolla/passwords.yml, contain service password in OpenStack<Nova, Cinder, Neutron, Keystone, Glance,...>)

#### 3. Kolla `globals.yml`

    sudo nano /etc/kolla/globals.yml
  
- add below script to `globals.yml` file

        kolla_base_distro: "ubuntu"
        kolla_install_type: "source"
        
        kolla_internal_vip_address: "188.166.218.13"
        network_interface: "eth0"
        neutron_external_interface: "eth1"
        nova_compute_virt_type: "qemu"
        enable_haproxy: "no"
        enable_cinder: "yes"
        enable_cinder_backup: "no"
        enable_cinder_backend_lvm: "yes"
        enalbe_heat: "no"
  
### **Step 6: Deploy OpenStack**

#### 1. Bootstrap servers with kolla deploy dependencies

    kolla-ansible -i all-in-one bootstrap-servers

#### 2. Do Pre-deployment checks for hosts

    kolla-ansible -i all-in-one prechecks

#### 3. Pull Image?

    kolla-ansible -i all-in-one pull 

#### 4. Finally proceed to actual OpenStack Deployment

    kolla-ansible -i all-in-one deploy

### Step 7: RESULT

#### 1. Checking OpenStack

- Open virtual env /etc/kolla/admin-opensrc.sh

        source /etc/kolla/admin-opensrc.sh

- generate token:

        openstack tokken issue

#### 2. access horizon

- get password for admin username.

        cat /etc/kolla/passwords.yml | grep keystone_admin

- access horizon

        username: admin
        password: NaMmcTxOHRa4cD6bNEWDkb08efRQJQL34rwnr5uF

### BUG

#### 1. Bug docker SDK version

- fix:

        sudo pip install -U docker

<!-- (Bug in step 6: Pre-deployment checks
 TASK [prechecks : Checking docker SDK version] *********************************************************************************************************************************************************************************************** -->

<!-- ## **BUG**

### 1. fatal: [localhost]: FAILED! => {"changed": false, "cmd": ["/usr/bin/python3", "-c", "import docker; print(docker.**version**)"], "delta": "0:00:00.247801", "end": "2022-05-06 16:26:38.165519", "failed_when_result": true, "msg": "non-zero return code", "rc": 1, "start": "2022-05-06 16:26:37.917718", "stderr": "Traceback (most recent call last):\n  File \"<string>\", line 1, in <module>\nModuleNotFoundError: No module named 'docker'", "stderr_lines": ["Traceback (most recent call last):", "  File \"<string>\", line 1, in <module>", "ModuleNotFoundError: No module named 'docker'"], "stdout": "", "stdout_lines": []}

    fix: update docker in pip (:(( chắc là do dùng vps)
    fix: sudo pip install -U docker

### TASK [cinder : Checking LVM volume group exists for Cinder] **********************************************************************************************************************************************************************************

fatal: [localhost]: FAILED! => {"changed": false, "cmd": ["vgs", "cinder-volumes"], "delta": "0:00:00.061967", "end": "2022-05-06 16:52:10.082823", "failed_when_result": true, "msg": "non-zero return code", "rc": 5, "start": "2022-05-06 16:52:10.020856", "stderr": "  Volume group \"cinder-volumes\" not found\n  Cannot process volume group cinder-volumes", "stderr_lines": ["  Volume group \"cinder-volumes\" not found", "  Cannot process volume group cinder-volumes"], "stdout": "", "stdout_lines": []}

    fix: (enable) cinder_volume_group: "cinder-volume" in globals.yml ??
    fix : =)) không bật

bug: treo
TASK [neutron : include_tasks] ***************************************************************************************
included: /path/to/venv/share/kolla-ansible/ansible/roles/neutron/tasks/deploy.yml for localhost

# Big problem?

Không thể ssh vào VPS ? cần cấu hình port để có thể ssh vào server
fix: <https://stackoverflow.com/questions/57413964/can-not-ssh-on-the-floating-ip-given-by-openstack-to-the-ubuntu-cloud-server-ima> -->
