# **Viettel-Digital-Talent-2022: Week 5 - Pratice 2**

## **Task: Deployment with Ansible**

## **Mục Lục**

- [**Viettel-Digital-Talent-2022: Week 5 - Pratice 2**](#viettel-digital-talent-2022-week-5---pratice-2)
  - [**Task: Deployment with Ansible**](#task-deployment-with-ansible)
  - [**Mục Lục**](#mục-lục)
  - [**I. Overview**](#i-overview)
    - [**1. Ansible**](#1-ansible)
      - [***a. Ansible là gì ?***](#a-ansible-là-gì-)
      - [***b. Kiến trúc của Ansible***](#b-kiến-trúc-của-ansible)
      - [***c. Ứng dụng của Ansible***](#c-ứng-dụng-của-ansible)
      - [***d. Các khái niệm cơ bản về Ansible***](#d-các-khái-niệm-cơ-bản-về-ansible)
  - [**II. Practicing**](#ii-practicing)
    - [**1. Prepare**](#1-prepare)
    - [**2. Resource**](#2-resource)
      - [***a. VPS***](#a-vps)
      - [***b. Source code***](#b-source-code)
    - [**3. Cài đặt Ansible**](#3-cài-đặt-ansible)

## **I. Overview**

### **1. Ansible**

- Trong thời buổi hiện nay, các ứng dụng ngày càng phức tạp và đòi hỏi một môi trường nhiều server để có thể hoạt động, điều này cũng đặt ra bài toán là làm thế nào để quản lý một số lượng lớn các server với vô vàn thứ phải lo như update các gói phần mềm, deploy, config ứng dụng, ... Những công việc này tuy không khó nhưng lại rất tốn thời gian.

- "Việc gì mà phải tự làm quá 3 lần thì không ổn rồi =))". Xuất phát từ mong muốn tự động hóa những thao tác lặp lại nhàm chán mà lại tốn thời gian, các công cụ IT Automation ra đời như một điều tất yếu.

- Hiện nay có rất nhiều các công cụ IT Automation cụ thể như: Chef, Puppet, CFEngine, StackStorm, SaltStack, Ansible,.. Và nổi tiếng nhất chính là `Ansible`.

#### ***a. Ansible là gì ?***

- Ansible là 1 Agent-less IT automation tool được phát triển bởi `Michael DeHaan` vào năm 2012.

- Ansible được tạo ra với mục đích: `minimal`, `consistent`, `secure`, `highly reliable`, `easy to learn`.

- Ansible chủ yếu chạy trong chế độ push sử dụng SSH, nghĩa là ta sẽ push các configurations từ server tới các agent. Nhưng ta cũng có thể chạy ansible sử dụng ansible-pull, nghĩa là ta có thể cài đặt ansible lên mỗi agent, sau đó download các playbook từ server về và chạy khi có 1 số lượng lớn các máy tính (số lượng lớn này là bao nhiêu thì tùy thuộc, nhưng ở đây là nhiều hơn 500 máy) và các updates cần thực hiện song song.

    ![ansible-logo](img/ansible-logologo.png)

#### ***b. Kiến trúc của Ansible***

![ansible-architecture](img/ansible-architectureecture.png)

- Ansible sử dụng kiến trúc agentless để giao tiếp với các máy khác mà không cần agent. Cơ bản nhất là giao tiếp thông qua giao thức SSH trên Linux, WinRM trên Windows hoặc giao tiếp qua chính API của thiết bị đó cung cấp.

- Ansible có thể giao tiếp với rất nhiều platform, OS và loại thiết bị khác nhau. Từ Ubuntu, CentOS, VMware, Windows cho tới AWS, Azure, các thiết bị mạng Cisco và Juniper….vân vân và mây mây….(hoàn toàn không cần agent khi giao tiếp).

- Chính cách thiết kế này làm tăng tính tiện dụng của Ansible do không cần phải setup bảo trì agent trên nhiều host. Có thể coi đây là một thế mạnh của Ansible so với các công cụ có cùng chức năng như Chef, Puppet, SaltStack (Salt thì hỗ trợ cả 2 mode là agent và agentless, có thời gian thì mình sẽ viết 1 bài về Salt).

#### ***c. Ứng dụng của Ansible***

- `Provisioning`: Khởi tạo VM, container hàng loạt trong môi trường cloud dựa trên API (OpenStack, AWS, Google Cloud, Azure…)

- `Configuration Management`: Quản lý cấu hình tập trung các dịch vụ tập trung, không cần phải tốn công chỉnh sửa cấu hình trên từng server.

- `Application Deployment`: Deploy ứng dụng hàng loạt, quản lý hiệu quả vòng đời của ứng dụng từ giai đoạn dev cho tới production.

- `Security & Compliance`: Quản lý các chính sách về an toàn thông tinmột cách đồng bộ trên nhiều môi trường và sản phẩm khác nhau (deploy policy, cấu hình firewall hàng loạt trên nhiều server…).

#### ***d. Các khái niệm cơ bản về Ansible***

- `Controller Machine`: Là máy cài Ansible, chịu trách nhiệm quản lý, điều khiển và gởi task tới các máy con cần quản lý.

- `Inventory`: Là file chứa thông tin các server cần quản lý. File này thường nằm tại đường dẫn /etc/ansible/hosts.

- `Playbook`: Là file chứa các task của Ansible được ghi dưới định dạng YAML. Máy controller sẽ đọc các task trong Playbook và đẩy các lệnh thực thi tương ứng bằng Python xuống các máy con.

- `Task`: Một block ghi tác vụ cần thực hiện trong playbook và các thông số liên quan. Ví dụ 1 playbook có thể chứa 2 task là: yum update và yum install vim.

- `Module`: Ansible có rất nhiều module, ví dụ như moduel yum là module dùng để cài đặt các gói phần mềm qua yum. Ansible hiện có hơn ….2000 module để thực hiện nhiều tác vụ khác nhau, bạn cũng có thể tự viết thêm các module của mình nếu muốn.

- `Role`: Là một tập playbook được định nghĩa sẵn để thực thi 1 tác vụ nhất định (ví dụ cài đặt LAMP stack).

- `Play`: là quá trình thực thi của 1 playbook

- `Facts`: Thông tin của những máy được Ansible điều khiển, cụ thể là thông tin về OS, network, system…

- `Handlers`: Dùng để kích hoạt các thay đổi của dịch vụ như start, stop service.

## **II. Practicing**

```Nội dung luyện tập của tuần này sẽ là Deploy một dự án lên môi trường production sử dụng công cụ Ansible.```

### **1. Prepare**

- Đầu tiên, ta cần tóm tắt lại những thư ta cần để thực hiện practice này:
  
  1. source code dự án đã được dockerize và được đẩy lên kho Github. Trong practice này, mình sẽ sử dụng dự án web-app fullstack mà mình đã thực hiện cho môn học trên trường. Repo: <https://github.com/ithaquaKr/ptit-learn-app>.
  
  2. VPS (Có thể tạo máy ảo bằng VMWare hoặc thuê từ các dịch vụ như Digital Ocean, Linode, AWS, GCP, ..etc..). Số lượng: 3 VPS, bao gồm 1 server để cài đặt công cụ Ansible - `ansible-server`, 1 server đảm nhiệm vai trò releases sản phẩm `production-server` và 1 server dành cho phát triển thử nghiệm `dev-server`.

- Những task sẽ thực hiện trong practice này:

    1. Cài đặt Ansible. Config `ansible-server` để quản lý các server trong hệ thống.

    2. Viết các playbook để tự động triển khai dự án trên 2 môi trường production và dev.

- Mô hình hệ thống:

### **2. Resource**

#### ***a. VPS***

- Như đã đề cập ở trên, bạn có thể sử dụng nhiều cách thức các nhau để tạo các VPS (VMWare, ...). Trong practice này, mình sẽ sử dụng dịch vụ Linode để thuê các VPS.

- Để tìm hiểu thêm về cách sử dụng Linode, tham khảo tại: <https://www.linode.com/>

- Sau một vài thao tác đơn giản với Linode ta đã có môi trường server như mong muốn.

- Thông tin về các server:

        1. ansible-server - IP : 139.162.45.170
        2. production-server - IP : 139.162.45.253
        3. dev-server - IP : 139.162.6.167

    ![ansible-server-info](img/ansible-server-info.png)

    ![production-server-info](img/production-server-info.png)

    ![dev-server-info](img/dev-server-info.png)

#### ***b. Source code***

- Giới thiệu qua một chút về dự án ta sẽ deploy thì đây là một web app mình viết theo kiến trúc MERN stack (mongoDB, ExpressJS, NodeJS, ReactJS).

- Cấu trúc của app:

    ![app-info](img/app-info.png)

- Như mục tiêu đặt ra thì app của chúng ta cần được dockerize trước. Sau khi đã dockerize ứng dụng thì việc deploy nó sẽ trở nên đơn giản hơn rất rất nhiều, ta chỉ việc pull source code về server và chạy `docker-compose up` là đã có thể triển khai thành công.

- Tìm hiểu về dockerize ứng dụng có thể tham khảo series: <https://viblo.asia/s/series-hoc-docker-cicd-tu-co-ban-den-ap-dung-vao-thuc-te-jeZ103QgKWz> hoặc chờ đợi pratice tiếp theo về docker và docker-compose trong khóa viettel-train này của mình ^^.

### **3. Cài đặt Ansible**

- Theo như mô hình đã thiết kế, ta sẽ thực hiện cài đặt Ansible lên `ansible-server`, có nhiều cách để cài đặt Ansible, trong practice này, ta sẽ sử dụng `pip`.

- Trước khi bắt tay vào cài đặt Ansible, ta cần đảm bảo một số yêu cầu bắt buộc trên môi trường dùng để cài Ansible bao gồm:
  
  - Python:
  
  - SSH

- 1. Thực hiện SSH vào `ansible-server`