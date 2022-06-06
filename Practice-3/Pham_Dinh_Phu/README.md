## PRACTICE 3: Set up a three-tier web application using docker-compose.   
----    

## Table of contents      

[I. Yêu cầu](#yêucầu)   
[II. Chuẩn bị](#chuanbi)   
- [1. Docker](#docker)   
- [2. Flask](#flask)  
- [3. Mongodb](#mongodb)      
- [4. Nginx](#nginx)  
- [5. Gunicorn](#gunicorn)   

[III. Cài đặt Docker trong Ubuntu 20.04 Server](#installdockertrongubuntu20.04Server)      
- [1. Cài đặt Docker Engine](#caidatdockerengine)     
- [2. Cài đặt Docker Compose](#caidatdockercompose)      

[IV. Homework](#baitap)    
- [1. ARG vs ENV](#argvsenv)    
- [2. COPY vs ADD](#copyvsadd)   
- [3. CMD vs ENTRYPOINT](#cmdvsentrypoint)     

[V. Tài liệu tham khảo](#tailieuthamkhao)     

----     

<a name='yeucau'></a>    

## I. Yêu cầu    
- Thiết lập một ứng dụng web three-tier hiển thị thông tin danh sách sinh viên tham gia VDT2022 trên browser sử dụng docker-compose.    
- Base images:   
   - nginx:1.22.0-alpine   
   - python:3.9  
   - mongo:5.0         

![image](images/Three-tier.png)   

<div align="center"> Three-tier web architecture</i></div>    

<a name='chuanbi'></a>     

## II. Chuẩn bị     

<a name='docker'></a>    
### 1. Docker      
- Docker là một PaaS (Platform as a Service) cho developing, shipping, and running applications (trên nền tảng ảo hóa).              
- Docker cung cấp khả năng đóng gói và chạy một ứng dụng trong một môi trường cô lập được gọi là `container`. Sự cô lập và bảo mật cho phép bạn chạy nhiều container đồng thời trên một host nhất định.                       

#### Kiến trúc, các thành phần Docker   
- Các thành phần:   
    - `Docker Engine` là một ứng dụng client-server với các thành phần chính sau:   
        - `Server`: hay còn gọi là `docker daemon` chịu trách nhiệm tạo, quản lý các Docker object như: image, containers, networks, volume.      
        - `REST API`: được `docker daemon` sử dụng để cung cấp các api cho client sử dụng để thao tác với docker.   
        - `Client`: là thành phần cuối cùng cung cấp một tập hợp các câu lệnh sử dụng API để người dùng thao tác với Docker.   
        VD: docker image, docker ps, docker network,...    

           
![image](images/Components.png)    

- Kiến trúc Docker     

![image](images/ArchitectureDocker.png)    

- Docker sử dụng kiến trúc client-server. Docker client sẽ giao tiếp với Docker daemon các công việc building, running và distributing các Docker container.       
- Docker client và daemon giao tiếp bằng REST API qua UNIX sockets hoặc một network interface.   
- Docker Registries để cho các docker image đăng ký lưu trữ qua Docker Hub để bạn hoặc người khác có thể pull về một cách dễ dàng.          

## Dockerfile   
- Docker image có thể được tạo ra tự động bằng cách đọc các chỉ dẫn trong `Dockerfile`.    
- Sử dụng `docker build` để tạo tự động.    

### Cấu trúc Docker   
- `FROM`:    
```   
FROM [--platform=<platform>] <image> [AS <name>]     
```    

- `ARG`(argument): được sử dụng để set biến môi trường với key và value, nhưng variables sẽ chỉ set trong image build không trong container


<a name='tailieuthamkhao'></a>   

## V.Tài liệu tham khảo    

[1] https://docs.docker.com/get-started/overview/  
