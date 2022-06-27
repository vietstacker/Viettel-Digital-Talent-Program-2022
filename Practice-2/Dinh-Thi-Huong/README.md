# Install Jenkins using Ansible Playbook


## Table of contents


- [I. Basic Knowledge](#i-basic-knowledge)


- [II. Prerequisites](##ii-prerequisites)


- [III. Step-by-step](#iii-step-by-step)


- [IV. References](#iv-references)


## I. Basic Knowlegde


### Jenkins


[**Jenkins**](https://www.jenkins.io/doc/) is a self-contained, open source automation server used to automate tasks associated with building, testing, and delivering/deploying software. Jenkins Pipeline implements continuous deliver pipelines into Jenkins through use of plugins and a Jenkinsfile. The Jenkinsfile can be Declarative or Scripted and contains a list of steps for the pipeline to follow.


### Ansible


[**Ansible**](https://docs.ansible.com/ansible/latest/index.html) is an simple configuration automation tool which uses SSH instead of installing agents on the target hosts. Something in the past that would have taken a complex script to automate can now be done with Ansible in a few lines of code using an Ansible Playbook. Ansible Playbooks use YAML, which is an easy to read language in plain English as compared to most scripting languages. With Ansible you have the ability to manage a plain text inventory file of hosts you want to keep track of or modify. These hosts can be grouped together or separately under different group headings. When building your Ansible Playbook you can differentiate which groups should run which modules.


## II. Prerequisites


In this article we will see how we can install and configure Jenkins using the Ansible Playbook. For setting up a Jenkins service on a remote node we need the below minimum requirements that should be satisfied.

– Remote node with Ubuntu 20.04 installed


– Minimum RAM – 256 MB


– Mimimum HD – 1 GB


> Note: I'll be using a virtual machine with OS Ubuntu 20.04 and RAM 4GB as remote node.


## III. Step-by-step


1. Install Ansible


```
sudo apt-get install software-properties-common
```


```
sudo apt-add-repository --yes --update ppa:ansible/ansible
```


```
sudo apt-get install ansible
```


Run command to confirm installation:
```
ansible --version
```


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/ansible-version.png)


2. Ansible Inventory File


Ansible inventory contains the hosts and groups of remote hosts. Its format supported: INI, YAML.


Create an inventory file named **inventory** with following contents:


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/inventory.png)


> **Note:**
>
> `servers` - group name
> 
> `192.168.122.19` - remote node IP address
> 
> `dinhuong` - remote node user
> 
> `1` - password of the remote node user


To get your remote node IP address, run command on remote host:
```
ip a
``` 


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/ip.png)


To check SSH connection to remote host:
```
ssh <user>@<ip>
```


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/ssh.png)


3. Ansible Playbook


Playbooks are Ansible's configuration, deployment and orchestration language. At basic level, playbooks contain the tasks to manage configurations of and deployments to remote machines.


Create a playbook file named **install-jenkins.yml** with following contents:


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/playbook.png)


4. Run the Ansible Playbook


```
ansible-playbook -i inventory install-jenkins.yml -K
```


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/run-playbook.png)


> **Note:** It may take up to 10 minutes. Keep calm :))


Once the Ansible Playbook has finished, you should see that some tasks are yellow, showing that something was changed and some are green, showing that the task ran successfully without changes.


5. Validate the Jenkins service URL


Access the Jenkins URL from remote network: **http://192.168.122.19:8080**


![image](https://github.com/dinhuong/Viettel-Digital-Talent-Program-2022/blob/main/Practice-2/Dinh-Thi-Huong/img/jenkins.png)


First time when you access the Jenkins URL, it will ask to enter the Jenkins user default password available in a particular file and then setup the user with which you want to login to the Jenkins portal. Once the user setup is completed it will ask to install a set of plugins or customize the plugin list that you want to install. Once you select on of those options the plugins will be installed and your Jenkins server is ready for use.


## IV. References
- [Installing Jenkins using an Ansible Playbook](https://medium.com/nerd-for-tech/installing-jenkins-using-an-ansible-playbook-2d99303a235f)
- [Install Jenkins with Ansible](https://www.youtube.com/watch?v=hBQtx1g3_IM)
