#  Containerization

*Set up a three-tier web application that displays the course attendees’ information on the browser using docker-compose.*
---

# **Table of Contents:**

## [I. Docker là gì?](#docker)
- ### [1. Containerization](#Contain)
- ### [2. Docker](#1Docker)
- ### [3. Docker-compose](#DockCom)
- ### [4. ARV and ENV](#AnE)
- ### [5. COPY and ADD](#CnA)
- ### [6. CMD and ENTRYPOINT](#CnE)

## [II. Thực nghiệm](#TN)

- ### [1. Cài đặt docker and docker-compose](#InstallDocker)
- ### [2. Cấu hình Nginx](#CauHinh)
- ### [3. Tạo database](#TDB)
- ### [4. Viết file tạo trang web](#VF)
- ### [5. Viết Dockerfile cho Flask và Webserver](#CDF)
- ### [6. Tạo file Docker-compose](#DCom)
- ### [7. Running Container](#RC)
- ### [8. Kết quả](#KQ)

## [III. Debugging](#DB)

## [IV. References](#RE)
---
<a name="docker"></a>
# **I. Docker là gì?**:
<img src= image/docker.jpg>

<a name="Contain"></a>
### 1. Containerization
- Containerization là giải pháp ảo hoá, tự động hóa thế hệ mới kế tiếp sau Hypervisor Virtualization, được các hãng công nghệ hàng đầu thế giới như Google, Facebook, Amazon áp dụng rộng rãi, đem lại hiệu quả đột phá với các ưu điểm vượt trội về tốc độ triển khai, khả năng mở rộng, tính an toàn và trải nghiệm người dùng.

<a name="1Docker"></a>
### 2. Docker
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

* *Dockerfile*

 Dockerfile là một file dạng text không có phần đuôi mở rộng, chứa các đặc tả về một trường thực thi phần mềm, cấu trúc cho Docker Image. Từ những câu lệnh đó, Docker sẽ build ra Docker image (thường có dung lượng nhỏ từ vài MB đến lớn vài GB).

> Cú pháp chung của một Dockerfile có dạng: 
 ```
    INSTRUCTION arguments
 ```
   `INSTRUCTION` là tên các chỉ thị có trong Dockerfile, mỗi chỉ thị thực hiện một nhiệm vụ nhất định, được Docker quy định. Khi khai báo các chỉ thị này phải được viết     bằng chữ IN HOA.
 Một Dockerfile bắt buộc phải bắt đầu bằng chỉ thị FROM để khai báo đâu là image sẽ được sử dụng làm nền để xây dựng nên image của bạn.
    aguments là phần nội dung của các chỉ thị, quyết định chỉ thị sẽ làm gì.	
* *Docker image*

 Docker image là một file bất biến - không thay đổi, chứa các source code, libraries, dependencies, tools và các files khác cần thiết cho một ứng dụng để chạy.

* *Docker container*
 
 Docker container là một run-time environment mà ở đó người dùng có thể chạy một ứng dụng độc lập. Những container này rất gọn nhẹ và cho phép bạn chạy ứng dụng trong đó rất nhanh chóng và dễ dàng.
* *FROM*

    Chỉ thị FROM là bắt buộc và phải được để lên phía trên cùng của Dockerfile.

    Cú pháp:
		 ```
		 FROM <image> [AS <name>]
		 FROM <image>[:<tag>] [AS <name>]
		 FROM <image>[@<digest>] [AS <name>]
		 ```

* *EXPOSE* 
        
 Thiết lập cổng mà container lắng nghe, cho phép các container khác trên cùng mạng liên lạc qua cổng này hoặc ánh xạ cổng host vào cổng này.

- *WORKDIR*

 Thiết lập thư mục làm việc trong container cho các lệnh COPY, ADD, RUN, CMD, và ENTRYPOINT
<a name="DockCom"></a>
### 3. Docker-compose
<img src= image/docker-com.jpg>
- Docker Compose là một công cụ dùng để định nghĩa và chạy các chương trình Docker sử dụng nhiều container (multi-container).
- - Những lợi ích khi sử dụng Compose:

- **Tạo ra nhiều môi trường độc lập (isolated environments) trong một host:** Compose cô lập môi trường của các project để đảm bảo chúng không bị xung đột lẫn nhau, cũng như dễ dàng tạo những bản sao của một môi trường nào đó.

- **Chỉ tạo lại các container đã thay đổi:** Compose sẽ nhận biết được các service chưa thay đổi và sử dụng lại các container tương ứng với service đó.

- **Điều chỉnh các biến sử dụng cho các môi trường:** Compose sử dụng các biến trong Compose file cho các môi trường. Vì vậy với môi trường hay người dùng khác nhau, có thể điều chỉnh các biến khi sử dụng Compose để thiết lập các service.

<a name="AnE"></a>
### 4. ARV and ENV
- `ARG` còn được gọi là biến `build-time`(chỉ hoạt động trong quá trình build images). Chúng chỉ khả dụng kể từ thời điểm chúng được 'công bố' trong `Dockerfile` trong câu lệnh `ARG` cho đến khi image được tạo.

- Các biến `ENV` cũng có sẵn trong quá trình xây dựng, ngay khi bạn khai báo chúng với một command của `ENV`. Tuy nhiên, không giống như `ARG`, khi build xong `image`, các container chạy image có thể truy cập giá trị `ENV` này. Các container chạy từ image có thể ghi đè giá trị của `ENV`.
> Cú pháp:
```
			ENV <key>=<value> 
```
  
<a name="CnA"></a>
### 5. COPY and ADD]
- Chỉ thị `ADD` sẽ thực hiện sao chép các tập, thư mục từ máy đang build hoặc remote file URLs từ src và thêm chúng vào filesystem của image dest.

> Cú pháp:

```
ADD [--chown=<user>:<group>] <src>... <dest>
ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]
```
       
Trong đó:
+ `src` có thể khai báo nhiều file, thư mục, ...
+ `dest` phải là đường dẫn tuyệt đối hoặc có quan hệ chỉ thị đối với `WORKDIR`. 
        
- Chỉ thị `COPY` cũng giống với `ADD` là *copy file*, thư mục từ `src` và thêm chúng vào `dest` của container. Khác với `ADD`, nó không hỗ trợ thêm các file remote file URLs từ các nguồn trên mạng.
> Cú pháp:

```
COPY [--chown=<user>:<group>] <src>... <dest>	       
COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]
```
<a name="CnE"></a>
### 6. CMD and ENTRYPOINT
- `CMD` thực hiện lệnh mặc định khi chúng ta khởi tạo container từ image, lệnh mặc định này có thể được ghi đè từ dòng lệnh khi khởi tại container.
- `CMD` cho phép ta set default command, có nghĩa là command này sẽ chỉ được chạy khi run container mà không chỉ định một command.
- Nếu docker run với một command thì default command sẽ được ignore. Nếu dockerfile có nhiều hơn một lệnh CMD thì tất cả sẽ bị ignore ngoại trừ lệnh CMD cuối cùng.
> Cú pháp:
```
		 CMD ["executable", "param1", "param2"]   (exec form)
		 CMD ["param1", "param2"]  (đặt các tham số mặc định cho ENTRYPOINT ở dạng exec form)
		 CMD command param1 param2   (shell form)
```
- `ENTRYPOINT` khá giống `CMD` đều dùng để chạy khi khởi tạo container, nhưng `ENTRYPOINT` không thể ghi đè từ dòng lệnh khi khi khởi tại container.
- Lệnh `ENTRYPOINT` cho phép ta cấu hình container sẽ chạy dưới dạng thực thi. Nó tương tự như CMD, vì nó cũng cho phép ta chỉ định một lệnh với các tham số. Sự khác biệt là lệnh `ENTRYPOINT` và các tham số không bị ignore khi Docker container chạy.
> Cú pháp:
```
		- ENTRYPOINT ["executable", "param1", "param2"] (exec form)
		- ENTRYPOINT command param1 param2 (shell form)
```

<a name="TN"></a>
## II. Thực nghiệm
<a name="InstallDocker"></a>
### 1. Cài đặt docker and docker-compose
- Cài đặt docker
```
sudo apt install docker
```
- Cài đặt docker-compose
```
sudo apt install docker-compose
```
<a name="CauHinh"></a>
### 2. Cấu hình Nginx
- Tạo thư mục `conf.d`
```
   mkdir conf.d
```
- Tạo file config:
```
   nano conf.d/app.conf
```
- Thiết lập cấu hình như sau:
```
upstream app_server {
    server flask:5000;
}

server {
    listen 80;
    server_name _;
    error_log  /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
    client_max_body_size 64M;

    location / {
        try_files $uri @proxy_to_app;
    }

    location @proxy_to_app {
        gzip_static on;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_buffering off;
        proxy_redirect off;
        proxy_pass http://app_server;
    }
}
```

<a name="TDB"></a>
### 3. Tạo database
- Tạo file json chứa dữ liệu:
```
   nano init-db.js
```
- Thêm nội dung database :
```json
db = db.getSiblingDB("flaskdb");
db.student.drop();

db.student.insertMany([
{ "STT" : 1, "Tên ứng viên" : "Võ Minh Thiên Long", "Năm sinh" : 2000, "Trường" : "Đại học Tổng hợp ITMO", "Chuyên ngành" : "Kỹ thuật phần mềm" },
{ "STT" : 2, "Tên ứng viên" : "Nguyễn Văn Hải", "Năm sinh" : 2001, "Trường" : "ĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 3, "Tên ứng viên" : "Trần Thu Thủy", "Năm sinh" : 2000, "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
...
]);
```
<a name="VF"></a>
### 4. Viết file tạo trang web
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
> Code:
```python
from flask import Flask, render_template
from pymongo import MongoClient
application = Flask(__name__)


def get_db():
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client.flaskdb
    return db

@application.route('/')
def get_stored_student():
    db=""
    try:
        db = get_db()
        _student = db.student.find()
        return render_template('index.html', todos= _student)
    except:
        pass
    finally:
        if type(db)==MongoClient:
            db.close()


if __name__ == "__main__":
    application.run(host='0.0.0.0', port=5000)
```
- Xây dựng file ```index.html``` để hiển thị danh sách
```
mkdir templates
nano templates/index.html
```
> Code:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VDT2022</title>
    <style>
        .todo {
            padding: 20px;
            margin: 10px;
            background-color: #eee;
        }
    </style>
</head>
<body>
    <h1>Danh sách lớp</h1>
    <table>
        <tr>
        <th>STT</th>
        <th>Tên ứng viên</th>
        <th>Năm sinh</th>
        <th>Trường</th>
        <th>Chuyên ngành</th>
        </tr>
        {% for todo in todos %}
        <tr>
        <td> {{ todo['STT'] }} </td>
        <td> {{ todo['Tên ứng viên']}} </td>
        <td> {{ todo['Năm sinh']}} </td>
        <td> {{ todo['Trường']}} </td>
        <td> {{ todo['Chuyên ngành']}} </td>
        </tr>
            <!--<p>{{ todo['STT'] }} <i>{{ todo['Tên ứng viên']}}</i> <i>{{ todo['Năm sinh']}}</i> <i>{{ todo['Trường']}}</i> <i>{{ todo['Chuyên ngành']}}</i></p> -->
        {% endfor %}
    </table>
    </div>
</body>

```
- Tạo file ```wsgi.py``` để chạy ```Gunicorn```:
```
nano app/wsgi.py
```
> Code:
```python
from app import application

if __name__ == "__main__":
  application.run()
```
<a name="CDF"></a>
### 5. Viết Dockerfile cho Flask và Webserver
- Tạo ```Dockerfile cho Flask trong thư mục ```app```:
```
   nano app/Dockerfile
```
- Cài đặt cấu hình như sau:
```
FROM python:3.9

WORKDIR /var/www

COPY . var/wwww

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn


EXPOSE 5000

CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi"]
```
  + Đầu tiên ta xác định base image,```Dockerfile``` này được chạy trên ```image:python3.9```. 
  + Tiếp theo ta xác định ```WORKDIR``` và ```COPY``` các file cần thiết để chạy app. File ```requirement``` chứa các thư viện cần thiết kèm với đó là ```gunicorn``` để có thể sử dụng ```nginx```
  + Cuối cùng xác định ```port``` mà flask expose và chạy ```CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi"] ``` để khởi động máy chủ ```gunicorn``` hoạt động trên ```port:5000```.
##### Dockerfile cho nginx
- Tiếp đến ta tạo thư mục nginx
```
   mkdir nginx
```
- Tạo ```Dockerfile``` cho ```nginx```
```
   nano nginx/Dockerfile
```
- Cấu hình ```Dockerfile``` như sau: 
```
FROM nginx:1.22.0-alpine


COPY conf.d/app.conf /etc/nginx/conf.d/app.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```
  + Với ```Nginx``` ta sử dụng based image là ```nginx:1.22.0-alpine ``` đã được xây dựng môi trường và cấu hình sẵn, ta chỉ cần ```COPY``` app.conf vào trong container. Dịch vụ ```Nginx``` sẽ chạy qua cổng ```:80``` với ```:433``` là cổng an toàn.
  + Dòng lệnh ```CMD ["nginx", "-g", "daemon off;"] ``` để khởi chạy ```Nginx server```. 

<a name="DCom"></a>
### 6. Tạo file Docker-compose
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
  + Ta sử dụng ```container_name``` để xác định tên container, thuộc tính ```image``` xác định tên image Docker gắn thẻ, ```restart``` khởi động lại khi container bị dừng, ```volumes``` mount dữ liệu trên host và container, ```depends_on``` giúp ta chắc chắn rằng flask chỉ chạy khi mongodb chạy cuối cùng là ```networks``` để xác định những gì flask sẽ truy cập đến.

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
  + Ta cấu hình mongodb như trên với ```enviroment``` giúp ta tạo user trong mongo, dữ liệu danh sách lớp được lấy từ file ```init-db.js``` mà ta sẽ xây dựng ở phần sau. Ta để ```ports``` kết nối qua cổng 27017 trên máy host và ```networks``` là backend
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
  + Ở đây ta sử dụng nginx làm webserver và base image là ```nginx:1.22.0-alpine```. Dịch vụ nginx sẽ chạy qua 2 cổng là ```:80``` và ```:433``` và ```volumes``` được mount tới ```/var/log/nginx/.``` cùng với đó xác định ```depends_on``` là flask và ```networks``` là backend.

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
### 7. Running Container
- Start và run app
```
docker-compose up -d
```
<img src= image/build.jpg>

- Kiểm tra

```
docker ps
```
<img src= image/run.jpg>

- Imgaes

```
docker images
```
<img src= image/images.jpg>

<a name="KQ"></a>
### 8. Kết quả
> 127.0.0.1:5000
<img src= image/result.jpg>

<a name="DB"></a>
## III. Debugging
- internal server error
<img src= image/Error.jpg>
> Trong thư mục `app` tạo một thư mục `templates` chứa file `index.html`

## IV. References
- [How To Set Up Flask with MongoDB and Docker](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker)
- [Docker Document](https://docs.docker.com/)
- [Dockerfile references](https://viblo.asia/p/dockerfile-references-3P0lPkmpZox)
- [Mongo imane](https://hub.docker.com/_/mongo)
- [How to deploy a Flask application with Docker, MongoDB, Nginx, Gunicorn](https://morioh.com/p/ff5cf8a37f67)

