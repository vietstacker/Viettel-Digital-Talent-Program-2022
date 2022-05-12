# Practice 1: Create Ubuntu virtual machine #
---
#### Check if CPU supports hardware virtualization:

```console
$ egrep -c '(vmx|svm)' /proc/cpuinfo
```
#### Check if system can use KVM acceleration:
```sh
 $ sudo kvm-ok
```
#### Install cpu-checker:
```sh
 $ sudo apt install cpu-checker
 ```
 #### Update apt & install essentails dependencies:
```sh
 $ sudo apt update
 $ sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
 ```
 #### Authorize Users:
```sh
 $ sudo adduser ‘username’ libvirt
 $ sudo adduser ‘[username]’ kvm
 ```
 #### Activate virtualization daemon:
```sh
 $ sudo systemctl enable --now libvirtd
 ```
 #### Install virt-manager, a tool for creating and managing VMs:
```sh
 $ sudo apt install virt-manager
 ```
 #### Install virt-manager, a tool for creating and managing VMs:
```sh
 $ sudo apt install virt-manager
 ```

# Practice: 2 Deploy Openstack AIO inside VM with Kolla

### Prepare:

- 2 Network Interface:

ens33: `192.168.31.128` (Host only)

ens38: `192.168.1.104` (Bridged)

### Step 1: Install dependencies

- Update the package index:

```
$ sudo apt update
```

- Install Python build dependencies:

```
$ sudo apt install python3-dev libffi-dev gcc libssl-dev
```

### Step 2: Install dependencies using a virtual environment

- Install the virtual environment dependencies:

```
$ sudo apt install python3-ven
```

- Create a virtual environment and activate it:

```
$ python3 -m venv path/to/venv

$ source path/to/venv/bin/activate
```
- Ensure the latest version of pip is installed:

```
$ pip install -U pip
```

- Install Ansible. Kolla Ansible requires at least Ansible 2.9 and supports up to 2.10:

```
$ pip install 'ansible==2.9.9'
```

### Step 3: Install Kolla-ansible

- Install kolla-ansible and its dependencies using pip:

```
$ pip install kolla-ansible
```

- Create the /etc/kolla directory:

```
$ sudo mkdir -p /etc/kolla

$ sudo chown $USER:$USER /etc/kolla
```

- Copy globals.yml and passwords.yml to /etc/kolla directory:

```
$ cp -r path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```

- Copy all-in-one and multinode inventory files to the current directory:

```
cp path/to/venv/share/kolla-ansible/ansible/inventory/* .
```

### Step 4: Configure Ansible

- Create file `/etc/ansible/ansible.cfg`:

```
[defaults]
host_key_checking=False
pipelining=True
forks=100
```

### Step 5: Prepare initial configuration

- Check whether the configuration of inventory is correct or not, run:

```
$ ansible -i all-in-one all -m ping
```

![Screenshot_1.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic1/Screenshot_1.png)

- Kolla passwords:

```
$ kolla-genpwd
```

![Screenshot_4.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic1/Screenshot_4.png)

- Kolla globals.yml:

```
kolla_base_distro: "ubuntu"
kolla_install_type: "source"
kolla_internal_vip_address: "192.168.1.104"
network_interface: "ens38"
neutron_external_interface: "ens33"
api_interface: "{{ network_interface }}"
enable_haproxy: "no"
```

### Step 6: Deployment

- Bootstrap servers with kolla deploy dependencies:

```
$ kolla-ansible -i ./all-in-one bootstrap-servers
```

- Do pre-deployment checks for hosts:

```
$ kolla-ansible -i ./all-in-one prechecks
```

- Finally proceed to actual OpenStack deployment:

```
$ kolla-ansible -i ./all-in-one deploy
```

![Screenshot_3.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic1/Screenshot_3.png)

### Step 7: Using OpenStack

- Install the OpenStack CLI client:

```
$ pip install python-openstackclient
```

- OpenStack requires an openrc file where credentials for admin user are set. To generate this file:

```
$ kolla-ansible post-deploy

$ . /etc/kolla/admin-openrc.sh
```

### Result

![Screenshot_7.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic1/Screenshot_7.png)

![Screenshot_6.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic1/Screenshot_6.png)

## Reference

[OpenStack Docs: Kolla Ansible quickstart](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)

