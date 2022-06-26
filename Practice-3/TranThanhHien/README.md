# **Sử dụng Docker-compose xây dựng website**

## **1. Docker**

### *Docker là gì?*

<img src= /img/docker-banner.png>

- Docker là một nền tảng để cung cấp cách để building, deploying và running ứng dụng dễ dàng hơn bằng cách sử dụng các containers (trên nền tảng ảo hóa). Ban đầu viết bằng Python, hiện tại đã chuyển sang Golang.

- Sự khác biệt giữa Docker container và Virtual Machine

| Docker | Virtual Machine |
| ----------- | ----------- |
| Kích thước (dung lượng) nhỏ. | Kích thước (dung lượng) lớn |
| Hiệu suất hạn chế | Hiệu suất gốc (native)|
| Mỗi máy ảo sẽ có một hệ điều hành riêng | Container sẽ sử dụng hệ điều hành của host |
| Ảo hóa về mặt phần cứng |Ảo hóa về mặt hệ điều hành | 
| Thời gian khởi động tính theo phút | Thời gian khởi động tính theo mili giây |
| Phân bổ bộ nhớ theo nhu cầu cần thiết | Yêu cầu ít dung lượng bộ nhớ hơn |
| Hoàn toàn bị cô lập và an toàn hơn | Cô lập ở mức tiến trình, có thể kém an toàn hơn |

### *Một số khái niệm trong Docker* 

<img src= /img/Docker-Architecture.png>

* *Dockerfile*

    Dockerfile là một file dạng text không có phần đuôi mở rộng, chứa các đặc tả về một trường thực thi phần mềm, cấu trúc cho Docker Image. Từ những câu lệnh đó, Docker sẽ build ra Docker image (thường có dung lượng nhỏ từ vài MB đến lớn vài GB).

    Cú pháp chung của một Dockerfile có dạng: 

    ```
    INSTRUCTION arguments
    ```
    INSTRUCTION là tên các chỉ thị có trong Dockerfile, mỗi chỉ thị thực hiện một nhiệm vụ nhất định, được Docker quy định. Khi khai báo các chỉ thị này phải được viết     bằng chữ IN HOA.
    Một Dockerfile bắt buộc phải bắt đầu bằng chỉ thị FROM để khai báo đâu là image sẽ được sử dụng làm nền để xây dựng nên image của bạn.
    aguments là phần nội dung của các chỉ thị, quyết định chỉ thị sẽ làm gì.	
- FROM

    Chỉ thị FROM là bắt buộc và phải được để lên phía trên cùng của Dockerfile.

    Cú pháp:
		 ```
		 FROM <image> [AS <name>]
		 FROM <image>[:<tag>] [AS <name>]
		 FROM <image>[@<digest>] [AS <name>]
		 ```

- EXPOSE 
        
     Thiết lập cổng mà container lắng nghe, cho phép các container khác trên cùng mạng liên lạc qua cổng này hoặc ánh xạ cổng host vào cổng này.

- WORKDIR

     Thiết lập thư mục làm việc trong container cho các lệnh COPY, ADD, RUN, CMD, và ENTRYPOINT

- COPY và ADD

    Chỉ thị ADD sẽ thực hiện sao chép các tập, thư mục từ máy đang build hoặc remote file URLs từ src và thêm chúng vào filesystem của image dest.

    Cú pháp:

		       ```
		       ADD [--chown=<user>:<group>] <src>... <dest>
		       ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]
		       ```
       
Trong đó:
+ src có thể khai báo nhiều file, thư mục, ...
+ dest phải là đường dẫn tuyệt đối hoặc có quan hệ chỉ thị đối với WORKDIR. 
        
Chỉ thị COPY cũng giống với ADD là copy file, thư mục từ <src> và thêm chúng vào <dest> của container. Khác với ADD, nó không hỗ trợ thêm các file remote file URLs từ các nguồn trên mạng.
Cú pháp:
	       ```
	       COPY [--chown=<user>:<group>] <src>... <dest>
	       COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]
	       ```
* RUN, CMD và ENTRYPOINT: Đều dùng để chỉ định và thực thi các lệnh:
  * RUN thực thi các lệnh command line và một layer mới. Ví dụ: thường được sử dụng để cài đặt các gói phần mềm.
    - Chỉ thị RUN dùng để chạy một lệnh nào đó trong quá trình build image và thường là các câu lệnh Linux. Tùy vào image gốc được khai báo trong phần FROM thì sẽ có các câu lệnh tương ứng. Ví dụ, để chạy câu lệnh update đối với Ubuntu sẽ là RUN apt-get update -y còn đối với CentOS thì sẽ là Run yum update -y. Kết quả của câu lệnh sẽ được commit lại, kết quả commit đó sẽ được sử dụng trong bước tiếp theo của Dockerfile.
     Cú pháp:
		```
		RUN <command>
		RUN ["executable", "param1", "param2"]
		```
     * CMD thực hiện lệnh mặc định khi chúng ta khởi tạo container từ image, lệnh mặc định này có thể được ghi đè từ dòng lệnh khi khởi tại container.
     - CMD cho phép ta set default command, có nghĩa là command này sẽ chỉ được chạy khi run container mà không chỉ định một command.
     - Nếu docker run với một command thì default command sẽ được ignore. Nếu dockerfile có nhiều hơn một lệnh CMD thì tất cả sẽ bị ignore ngoại trừ lệnh CMD cuối cùng.
     Cú pháp:
		```
		- CMD ["executable", "param1", "param2"]   (exec form)
		- CMD ["param1", "param2"]  (đặt các tham số mặc định cho ENTRYPOINT ở dạng exec form)
		- CMD command param1 param2   (shell form)
		```
* ENTRYPOINT khá giống CMD đều dùng để chạy khi khởi tạo container, nhưng `ENTRYPOINT` không thể ghi đè từ dòng lệnh khi khi khởi tại container.
     - Lệnh ENTRYPOINT cho phép ta cấu hình container sẽ chạy dưới dạng thực thi. Nó tương tự như CMD, vì nó cũng cho phép ta chỉ định một lệnh với các tham số. Sự khác biệt là lệnh ENTRYPOINT và các tham số không bị ignore khi Docker container chạy.
      Cú pháp:
		```
		- ENTRYPOINT ["executable", "param1", "param2"] (exec form)
		- ENTRYPOINT command param1 param2 (shell form)
		```
* ARG VÀ ENV

    ARG còn được gọi là biến build-time(chỉ hoạt động trong quá trình build images). Chúng chỉ khả dụng kể từ thời điểm chúng được 'công bố' trong Dockerfile trong câu lệnh ARG cho đến khi image được tạo.

    Các biến ENV cũng có sẵn trong quá trình xây dựng, ngay khi bạn khai báo chúng với một command của ENV`. Tuy nhiên, không giống như ARG, khi build xong image, các container chạy image có thể truy cập giá trị ENV này. Các container chạy từ image có thể ghi đè giá trị của ENV.
    Cú pháp:
			```
			ENV <key>=<value> 
			```
  
    
* *Docker image*

    Docker image là một file bất biến - không thay đổi, chứa các source code, libraries, dependencies, tools và các files khác cần thiết cho một ứng dụng để chạy.

* *Docker container*

    Docker container là một run-time environment mà ở đó người dùng có thể chạy một ứng dụng độc lập. Những container này rất gọn nhẹ và cho phép bạn chạy ứng dụng trong đó rất nhanh chóng và dễ dàng.

## **2. Xây dựng website**

Set up a three-tier web application that displays the course attendees’ information on the browser using docker-compose.

* Base images:

    * nginx:1.22.0-alpine
    * python:3.9
    * mongo:5.0
* Chuẩn bị:
    * Máy chủ để build image
    * Cài đặt Docker trên Ubuntu 20.4 ((https://vsudo.net/blog/docker-ubuntu.html)
    * Cài đặt Docker, Docker Compose trên Ubuntu 20.04 ((https://thuanbui.me/huong-dan-cai-dat-docker-docker-compose-tren-ubuntu-20-04/)

### 2.1. Cấu hình Nginx
- Tiếp đến ta tạo thư mục nginx
```
   mkdir nginx
```
- Tạo thư mục `conf.d`
```
   mkdir conf.d
```
- Tạo file config:
```
   nano conf.d/app.conf
```
- Thiết lập cấu hình như sau:
<img src= /img/appconf.png>
<a name="TDB"></a>
### 2.2. Tạo database
- Tạo file json chứa dữ liệu:
```
   nano init-db.js
```
- Thêm nội dung database :
<img src= /img/int-db.png>
<a name="VF"></a>
### 2.3. Viết file tạo trang web
- Tạo thư mục `app`:
```
mkdir app
```
- Tạo file ```requiriments.txt```
```
nano app/requirements.txt
```
> Nội dung:
```
flask
pymongo
```
- Xây dựng ```app.py``` bao gồm Flask app trong mục ```app```:
```
nano app/app.py
```
<img src= /img/app.py.png>
- Xây dựng file ```index.html``` để hiển thị danh sách
```
mkdir templates
nano templates/index.html
```
> Code:
<img src= /img/index.png>
- Tạo file ```wsgi.py``` để chạy ```Gunicorn```:
```
nano app/wsgi.py
```
> Code:
<img src= /img/wsgi.png>
<a name="CDF"></a>
### 2.4. Viết Dockerfile cho Flask và Webserver
- Tạo ```Dockerfile cho Flask trong thư mục ```app```:
```
   nano app/Dockerfile
```
- Cài đặt cấu hình như sau:
<img src= /img/appDF.png>
##### Dockerfile cho nginx
- Tạo ```Dockerfile``` cho ```nginx```
```
   nano nginx/Dockerfile
```
- Cấu hình ```Dockerfile``` như sau: 
<img src= /img/nginxDF.png>
  
### 2.5. Tạo file Docker-compose
- Tạo file `docker-compose.yml`:
```
nano docker-compose.yml
```
- Xác định Flask:
```yml
version: '3'
services:
  flask:
    build:
      context: app
      dockerfile: Dockerfile
    container_name: flask
    image: python3.9
    restart: unless-stopped
    environment:
      APP_ENV: "prod"
      APP_DEBUG: "False"
      APP_PORT: 5000
    volumes:
      - appdata:/var/www
    depends_on:
      - mongodb
    networks:
      - frontend
      - backend
```
- Cấu hình cho mongodb
```yml
 mongodb:
    image: mongo:5.0.0
    container_name: mongodb
    hostname: test_mongodb
    environment:
      - MONGO_INITDB_DATABASE=flaskdb
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=pass
    volumes:
      - ./init-db.js:/docker-entrypoint-initdb.d/init-db.js:ro
    ports:
      - 27017:27017
    networks:
      - backend
```
- Cấu hình webserver cho ứng dụng.
```yml
webserver:
    build:
      context: nginx
      dockerfile: Dockerfile
    image: nginx:1.22.0-alpine
    container_name: webserver
    restart: unless-stopped
    environment:
      APP_ENV: "prod"
      APP_NAME: "webserver"
      APP_DEBUG: "true"
      SERVICE_NAME: "webserver"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - nginxdata:/var/log/nginx
    depends_on:
      - flask
    networks:
      - frontend
```
- Xác định ```networks``` và ```volumes```:
```yml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
volumes:
  appdata:
    driver: local
  nginxdata:
    driver: local
```

<a name="RC"></a>
### 2.6. Running Container
- Start và run app
```
docker-compose up -d
```
	
<img src= /img/docker-composeup1.png>
	
<img src= /img/buildingflask.png>
	
<img src= /img/docker-composeup2.png>

<img src= /img/docker-composeup.png>
	

- Kiểm tra

```
docker ps
```
<img src= /img/run.png>

- Imgaes

```
docker images
```
<img src= /img/images.png>

<a name="KQ"></a>
### 2.7. Kết quả
> 0.0.0.0
<img src= /img/result_practice3.png>
<a name="DB"></a>
	
## **3. Tham khảo**
	
- [How To Set Up Flask with MongoDB and Docker](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker)
- [How to deploy a Flask application with Docker, MongoDB, Nginx, Gunicorn](https://morioh.com/p/ff5cf8a37f67)
