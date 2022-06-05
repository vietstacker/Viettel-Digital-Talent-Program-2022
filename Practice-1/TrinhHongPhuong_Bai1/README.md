# **Setup OpenStack AIO with Kolla**
## **I. Requirements**
**Operating System**: Ubuntu Server (Ubuntu Server 20.04 is used in below practices).
## **II. Step-by-step**
### **1. Install dependencies**
- Update the package index
```
$ sudo apt update && sudo apt dist-upgrade -y
```
- Install Python build dependencies
```
sudo apt install python3-dev libffi-dev gcc libssl-dev
```
- Install `pip`
```
sudo apt install python3-pip
```
- Ensure the latest version of pip is installed
```
sudo pip3 install -U pip
```
- Install Ansible. Kolla Ansible requires at least Ansible 4 and supports up to 5
```
sudo pip install -U 'ansible>=4,<6'
```
## **2. Install Kolla-ansible**
- Install kolla-ansible and its dependencies using `pip`
```
sudo pip3 install git+https://opendev.org/openstack/kolla-ansible@master
```
- Create the /etc/kolla directory. 
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
## **3. Install Ansible Galaxy requirements**
- Install Ansible Galaxy dependencies
```
kolla-ansible install-deps
```
## **4. Configure Ansible**
- Add the following options to the Ansible configuration file `/etc/ansible/ansible.cfg`
```
[defaults]
host_key_checking=False
pipelining=True
forks=100
```
- Check whether the configuration of inventory is correct or not, run:
```
ansible -i multinode all -m ping
```
> Ping Success:
<img src="./img/ping_success.png">

## **5. Kolla passwords**
- Passwords used in our deployment are stored in `/etc/kolla/passwords.yml` file. All passwords are blank in this file and have to be filled either manually or by running random password generator. Run:
```
kolla-genpwd
```
## **6. Kolla globals.yml**
- globals.yml is the main configuration file for Kolla Ansible. There are a few options that are required to deploy Kolla Ansible
```
kolla_base_distro: "ubuntu"
kolla_install_type: "source"
network_interface: "lo"
neutron_external_interface: "enp3s0"
kolla_internal_vip_address: 127.0.0.1
enable_haproxy: "no"
```
## **7. Deployment**
- Bootstrap servers with kolla deploy dependencies
```
kolla-ansible -i ./all-in-one bootstrap-servers
```
> Result:
<img src="./img/bootstrap_servers.png">

- Do pre-deployment checks for hosts
```
kolla-ansible -i ./all-in-one prechecks
```
> Result:
<img src="./img/precheck.png">

- Finally proceed to actual OpenStack deployment
```
kolla-ansible -i ./all-in-one deploy
```
> Result:
<img src="./img/deploy.png">

## **III. Access Horizon dashboard**
- Use following account
    + User: admin
    + Password: Run command
```
cat /etc/kolla/passwords.yml | grep -i keystone_admin_password
```
> OpenStack Login Page:
<img src="./img/login.png">

> OpenStack Dashboard:
<img src="./img/dashboard.png">

## **IV. References**
- [Official Document of `Kolla Ansible` - Deploy All-in-one OpenStack](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)
- [Deploy All-In-One Openstack using Kolla-Ansible project](https://www.youtube.com/watch?v=b-XgSPuedro)

