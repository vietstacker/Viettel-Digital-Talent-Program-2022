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
### **Step 3**: Open Hyper-V Manager
### **Step 4**: Create a virtual machine with the specs above
#### **Substep 4.1**: Download Ubuntu server 20.04 iso file
#### **Substep 4.2**: Edit VM's specification
#### **Substep 4.3**: Start VM
### **Step 5**: Enable SSH connection for VM
In VM's terminal, type the command below to allow SSH connection:
```
sudo ufw allow 22
```
To use password login:
```
```
### **Step 6**: Connect to the VM from another device
#### **Substep 6.1**: Find VM's IP address
#### **Substep 6.2**: Connect to the VM via SSH

```
ssh root@<ip_address>
```
ip_address here could be internal IP from the network

## **Task 2**: *Install OpenStack*