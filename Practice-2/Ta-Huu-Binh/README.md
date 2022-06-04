# **Deploy a project by Ansible**
## **Table of Contents**

- [I. Overview ](#overview)   
   - [1. Need to know](#need_to_know)           
   - [2. Requirements](#requirements) 

- [II. Deploy a project by Ansible](#deploy)  
   - [A. Install SSH server and Ansible in Ubuntu](#ssh)     
   - [B. Pre-deploy configuration](#pre_deploy_conf)   
   - [C. Deployment](#deployment)   

- [III. References](#refs)         
----  

## I. Overview
<a name='overview'></a >  

### 1. Need to know
<a name='need_to_know'></a >  

- Basic on System Administration (Linux, Networking, etc)
- Basic on `Ansible`:
> *Ansible is an open-source software provisioning, configuration management, and application-deployment tool enabling infrastructure as code*

### 2. Requirement
<a name='requirement'></a >  

- **Management Node Operating System**: *Ubuntu 20.04*
- **Host Operating System:** *Ubuntu 20.04*
- **Desktop Hypervisor:** *Virtual Box*
- **Application Installation** *git, vim, pip*
- **A project from git or dockhub**

## II. Deploy a project by Ansible
<a name='deploy'></a >  

## **A. Install SSH server in Ubuntu**:
<a name='ssh'></a > 

### 1. Update `apt` & install `openssh-server`:

```
$ sudo apt update

$ sudo apt-get install openssh-server
```

### 2. Enable the ssh service by typing:

```
$ sudo systemctl enable ssh
```

### 3. Start the ssh service by typing:
```
$ sudo systemctl start ssh
```

### 4. Test by logining into the host system:

```
$ ssh {host_name}@{host_ip}
```
### 5. Install Ansible:
```
$ sudo apt-get install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt-get install ansible
```

or

```
$ sudo pip install ansible
```

## **B. Pre-deploy configuration**
<a name='pre_deploy_conf'></a > 


### 1. Create an inventory file with following contents:

```
$ cat inventory
[{group name}]
localhost ansible_connection=local
{host_ip} ansible_ssh_user={host_name} ansible_ssh_pass='host_password'
```

### 2. Configure `ansible.cfg`:
```
$ cat /etc/ansible/ansible.cfg
[defaults]
host_key_checking = False
```

### 3. Run `ad-hoc` commands to check configuration:
#### Ping to host:

```
$ ansible -i inventory -m ping {group name}
```
#### Echo "Hello" on host:
```
$ ansible -i inventory -m shell -a "/bin/echo Hello" {group name}
```

**Note:**
>  Host must be on 

## **C. Deployment**:
<a name='deployment'></a > 

### 1. Create a playbook file named *hello.yml* with following contents:
```
- name: create a directory and a file
  hosts: servers

  tasks:
          - name: Create a new directory
            file:
                    path: "/tmp/lesson1"
                    state: directory
```

### 2. Run playbook to create a new directory:
```
$ ansible-playbook -i inventory hello.yml
```

### 3. Append a new task to *hello.yml*:
```
- name: create a directory and a file
  hosts: servers

  tasks:
          - name: Create a new directory
            file:
                    path: "/tmp/lesson1"
                    state: directory
          - name: Clone from github
            git:
                    repo: https://github.com/Tahuubinh/WebFunnel.git
                    dest: "/tmp/lesson1"
                    force: yes
```

### 4. Run playbook again to pull a project from github:
```
$ ansible-playbook -i inventory hello.yml
```

### 5. Run again to see `idempotent` property:

```
$ ansible-playbook -i inventory hello.yml
```

<img src="./imgs/Login.png">



## III. References
<a name='refs'></a >  

[1] https://www.serverlab.ca/tutorials/dev-ops/automation/how-to-use-ansible-to-deploy-your-website/
 
[2] https://docs.ansible.com/ansible/latest/user_guide/index.html#getting-started
