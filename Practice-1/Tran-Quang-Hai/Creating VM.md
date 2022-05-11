# **PRACTICE 1**

## **Task 1**: *Create Ubuntu virtual machine*

### **Host system OS**: Windows 11
### **Virtualization engine**: Hyper-V
### * Hyper-V requires Intel Virtualization Technology (Intel VT) to be enabled in BIOS
### **VM's specs**:  
#### - OS: Ubuntu 20.04 server (terminal only)
#### - CPU cores: 4
#### - RAM: 6144MB (6GB)
#### - Storage: 60GB
### **Step 1**: Enable Intel VT in BIOS
#### **Substep 1.1**: Restart the host machine
#### **Substep 1.2**: Accessing BIOS by pressing F1/F2/DEL... depends on host machine's motherboard
#### **Substep 1.3**: Enable VT in BIOS
### **Step 2**: Enable Hyper-V related features in Windows 11
Open Control Panel -> Turn Windows Features on or off -> Find Hyper-V and enable them all.
### **Step 3**: Open Hyper-V Manager, click New -> Virtual Machine

<img src="imgs/1-Creating VM.png">

### **Step 4**: Create a virtual machine with the specs above
#### **Substep 4.1**: Download Ubuntu server 20.04 iso file and add its path

<img src="imgs/2-Adding ISO file.png">

#### **Substep 4.2**: Edit VM's specification

Both Generation 1 and Generation 2 are acceptable

<img src="imgs\3-VM generation type.png">

Specify the size of the virtual hard drive that you are going to give the VM

<img src="imgs\4-Virtual Hard Disk.png">

**IMPORTANT:** For Connection part, you have to choose Virtual Switch option to help the VM connect to the Internet

<img src="imgs\5-Connection.png">

After finishing to create the VM, right-click on the VM's name and choose Settings

<img src="imgs\6-Settings.png">

Here you can edit VM's specs, such as CPU cores, RAM, hard drive, ...

<img src="imgs\7-Specs.png">


#### **Substep 4.3**: Start VM

Start and then Connect to the VM

<img src="imgs\8-Start.png">

Just press OK/Yes for all questions (it's just a VM) to finish installation

Screen after connect and login to the VM

<img src="imgs\9-Console.png">

### **Step 5**: Enable SSH connection for VM
In VM's terminal, type the command below to allow SSH connection:
```
sudo ufw allow 22 | sudo ufw enable | sudo ufw reload
```
<img src="imgs\10-Allow SSH connection.png">

### **Step 5**: Enable SSH connection for VM
In VM's terminal, type the command below to allow SSH connection:
```
sudo ufw allow 22
```
To use password login:
In /etc/ssh/sshd_config file, replace this row:
```
PasswordAuthentication no
```
to:
```
PasswordAuthentication yes
```

### **Step 6**: Connect to the VM from another device
#### **Substep 6.1**: Find VM's IP address

Check for VM's public IP address
```
curl ifconfig.co
```

#### **Substep 6.2**: Connect to the VM via SSH

```
ssh <username>@<ip_address>
```
ip_address here could be internal IP from the network
