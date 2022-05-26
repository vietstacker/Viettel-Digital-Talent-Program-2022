# Set up OpenStack AIO inside VM with Kolla

## Table of contents
[I. Requirements](#i-requirements)
[II. Step-by-step](#ii-step-by-step)
[III. References](#iii-references)

## I. Requirements
OS: Ubuntu Desktop 20.04
Hypervisor: KVM
VM Specifications:
- RAM: 4GB
- Network: 2 NICs:
> enp1s0: 192.168.122.19/24


> enp6s0: 192.168.122.189/24

## II. Step-by-step
1. Install dependencies
- Update the package index
``` 
sudo apt update
```
- Install Python build dependencies
- Install ```pip```
```
sudo apt install python3-pip
```
- Ensure the lastest version of pip is installed
```
sudo pip3 install -U pip
```
- Install Annsible. Kolla Ansible requires at least Ansible 4 and supports up to 5.
```
sudo pip install -U 'ansible>=4,<6'
```
2. Install Kolla-ansible
- Install kolla-ansible and its dependencies using pip
```
sudo pip3 install git+https://opendev.org/openstack/kolla-ansible@master
```
- Create the /etc/kolla directory
```
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla
```
- Copy globals.yml and passwords.yml to /etc/kolla directory
```
cp -r /usr/local/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```
- Copy all-in-one and multinode inventory files to the current directory
```
cp /usr/local/share/kolla-ansible/ansible/inventory/* .
```
3. Install Ansible Galaxy requirements
- Install Ansible Galaxy dependencies (Yoga release onwards)
```
kolla-ansible install-deps
```
4. Configure Ansible
- Add the following options to the Ansible configuration file ```/etc/ansible/ansible.cfg```
```
[defaults]
host_key_checking=False
pipelining=True
forks=100
```

5. Prepare initial configuration
- Check whether the configuration of inventory is correct or not, run:
```
ansible -i all-in-one all -m ping
```
![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/ping.png)


- Fill all passwords in ```/etc/kolla/passwords.yml``` by running random password generator:
```
kolla-genpwd
```
- Kolla globals.yml
```
kolla_base_distro: "ubuntu"
kolla_install_type: "source"
network_interface: enp1s0
neutron_external_interface: enp6s0
kolla_internal_vip_address: 192.168.122.19
enable_haproxy: "no"
```
6. Deployment
- Bootstrap servers with kolla deploy dependencies
```
kolla-ansible -i ./all-in-one bootstrap-servers
```
![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/bootstrap.png)


- Do pre-deployment checks for hosts
```
kolla-ansible -i ./all-in-one prechecks
```
![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/precheck.png)


- Finally proceed to actual OpenStack deployment
```
kolla-ansible -i ./all-in-one deploy
```
![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/deploy.png)


8. Using OpenStack
- Install the OpenStack CLI client
```
pip install python-openstackclient -c https://releases.openstack.org/constraints/upper/master
```
- Generate an openrc file where credentials for admin user are set
```
kolla-ansible post-deploy 
. /etc/kolla/admin-openrc.sh
```
![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/postdeploy.png)


- Access Horizon Dashboard
> URL: http://192.168.122.19


> Username: admin


> Password: run command ```cat /etc/kolla/passwords.yml | grep -i keystone_admin_password```


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/password.png)


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/login.png)


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-1/Dinh-Thi-Huong/img/dashboard.png)


## III. References
- [Official Document of Kolla Ansible](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)
