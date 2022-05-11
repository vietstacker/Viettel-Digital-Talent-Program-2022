
# WEEK 3: OpenStack

## Practice: Deploy Openstack AIO inside VM with Kolla

### Prepare:

- 2 Network Interface:

enp1s0: `192.168.122.192/24` (Bridge)

enp6s0: `192.168.100.211/24` (Host only)

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
```
- And then activate it:
```
$ source path/to/venv/bin/activate
```
- Ensure the latest version of pip is installed:

```
$ pip install -U pip
```

- Install Ansible. Kolla Ansible requires at least Ansible 2.9 and supports up to 2.10:

```
$ pip install 'ansible==2.10'
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

![img1]()

- Kolla passwords:

```
$ kolla-genpwd
```

![img2]()

- Kolla globals.yml:

```
kolla_base_distro: "ubuntu"
kolla_install_type: "source"

network_interface: enp6s0
neutron_external_interface: enp1s0
kolla_internal_vip_address: 192.168.122.192

nova_compute_virt_type: "qemu"

enable_haproxy: "no"

enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"
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

![img3]()

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

![img4]()

![img5]()

## Reference

[OpenStack Docs: Kolla Ansible quickstart](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)
