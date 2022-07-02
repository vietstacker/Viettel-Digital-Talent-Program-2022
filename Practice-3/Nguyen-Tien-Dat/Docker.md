#  Containerization
---

# **Table of Contents:**

## I. Docker
- ### 1. Containerization
- ### 2. Docker
- ### 3. Docker-compose


## II. Bài tập

- ### 1. ARV and ENV
- ### 2. COPY and ADD
- ### 3. CMD and ENTRYPOINT
- ### 4. Cài đặt docker and docker-compose
- ### 5. Cấu hình Nginx
- ### 6. Tạo database
- ### 7. Viết file tạo trang web
- ### 8. Viết Dockerfile cho Flask và Webserver
- ### 9. Tạo file Docker-compose
- ### 10. Running Container

## III. References
---

# **I. Docker**:
<img src= images/docker.png>

### 1. Containerization
- Containerization là giải pháp ảo hoá, tự động hóa thế hệ mới kế tiếp sau Hypervisor Virtualization, được các hãng công nghệ hàng đầu thế giới như Google, Facebook, Amazon áp dụng rộng rãi, đem lại hiệu quả đột phá với các ưu điểm vượt trội về tốc độ triển khai, khả năng mở rộng, tính an toàn và trải nghiệm người dùng.

### 2. Docker
- Docker là một nền tảng để cung cấp cách để building, deploying và running ứng dụng dễ dàng hơn bằng cách sử dụng các containers (trên nền tảng ảo hóa). Ban đầu viết bằng Python, hiện tại đã chuyển sang Golang.

### *Một số thuật ngữ trong Docker* 

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

### 3. Docker-compose
<img src= images/docker-compose.png>

- Docker Compose là một công cụ dùng để định nghĩa và chạy các chương trình Docker sử dụng nhiều container (multi-container).

# **II. Bài tập**:

### 1. *ARG* và *ENV*

- **ARG** hay còn gọi là biến build-time chỉ hoạt động trong quá trình build-image, hoạt động kể từ thời điểm chúng được khai báo trong Dockerfile trong câu lệnh ARG cho đến khi image được tạo. Khi chạy container, chúng ta không thể truy cập giá trị của các biến ARG và chúng chạy duới giá trị mặc định, nếu thay đổi lệnh build sẽ lỗi.

- **ENV** có sẵn trong quá trình xây dựng, ngay khi bạn khai báo chúng với một command của ENV. Tuy nhiên, không giống như ARG, khi build xong image, các container chạy image có thể truy cập giá trị ENV này.Bên cạnh đó các container chạy từ image có thể ghi đè giá trị của ENV.

<img src= images/argvsenv.png>

### 2. *COPY* và *ADD*

Lệnh **COPY** sẽ sao chép các tệp mới từ src và thêm chúng vào hệ thống tệp của bộ chứa tại đường dẫn dest
```
  COPY <src> <dest>
```
 Lệnh **ADD** cũng sao chép các tệp mới từ src và thêm chúng vào hệ thống tệp của bộ chứa tại đường dẫn dest
 ```
  ADD ["< src >",... "< dest >"] 
```
<img src= images/copyvsadd.png>

Nhìn chung **COPY** và **ADD** khá tương tự nhau về mặt chức năng, xong chúng vẫn có những diểm khác nhau cơ bản.
 
- **COPY** sao chép một tập tin / thư mục từ máy chủ của bạn vào image.

- **ADD** sao chép một tập tin / thư mục từ máy chủ vào image, nhưng cũng có thể tìm nạp các URL từ xa, trích xuất các tệp TAR, v.v ... 

### 3. *CMD* và *ENTRYPOINT*
Cả hai lệnh (**CMD** và **ENTRYPOINT**) có thể được chỉ định ở dạng shell form hoặc dạng exec form.
- Dạng shell form 
```
<instruction> <command>
```
- Dạng exec form
```
<instruction> ["executable", "param1", "param2", ...]
```
<img src= images/cmdvsentry.png>

Thoạt nhìn, chúng đều được sử dụng để chỉ định và thực thi các lệnh nhưng chúng cũng có những điểm khác nhau.
- **CMD** cho phép ta set default command, có nghĩa là command này sẽ chỉ được chạy khi run container mà không chỉ định một command. CMD thì tất cả sẽ bị ignore ngoại trừ lệnh CMD cuối cùng.
- **ENTRYPOINT** cho phép ta cấu hình container sẽ chạy dưới dạng thực thi. Nó tương tự như CMD, vì nó cũng cho phép ta chỉ định một lệnh với các tham số. Sự khác biệt là lệnh ENTRYPOINT và các tham số không bị ignore khi Docker container chạy.

### 4. Cài đặt docker and docker-compose

- Docker [(Hướng dẫn cài đặt)](https://vsudo.net/blog/docker-ubuntu.html)
- Docker-compose [(Hướng dẫn cài đặt)](https://thuanbui.me/huong-dan-cai-dat-docker-docker-compose-tren-ubuntu-20-04/)

Cấu trúc file sẽ gồm có:
```bash
__ flaskapp
    |__ ningx
        |__ Dockerfile
        |__ conf.d
            |__ app.c
    |__ app
        |__ Dockerfile
        |__ requirements.txt
        |__ app.py
        |__ wgsi.py
        |__ templates
           |__ index.html
    |__ docker-compose.yml
    |__ init-db-js
```
### 5. Cấu hình Nginx
NGINX trong project sẽ đóng 2 vai trò, 1 serving các static file như HTML, CSS, JS cho client và làm một proxy server để forward các API request đến Web Server. Trong bước này ta sẽ cấu hình ```Nginx``` để tạo proxy ngược chuyển tiếp các yêu cầu đến ```Gurnicorn``` trên cổng 5000.

- Tạo file config:
```
   vi app.conf
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

### 6. Tạo database
- Tạo file json chứa dữ liệu:
```
   vi init-db.js
```
- Thêm nội dung database :
```json
db = db.getSiblingDB("flaskdb");
db.student.drop();
db.student.insertMany([
{ "STT" : 1, "Tên ứng viên" : "Võ Minh Thiên Long", "Năm sinh" : "2000", "Trường" : "Đại học Tổng hợp ITMO", "Chuyên ngành" : "Kỹ thuật phần mềm" },
{ "STT" : 2, "Tên ứng viên" : "Nguyễn Văn Hải", "Năm sinh" : "2001", "Trường" : "ĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 3, "Tên ứng viên" : "Trần Thu Thủy", "Năm sinh" : "2000", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 4, "Tên ứng viên" : "Hồ Nguyên Khang", "Năm sinh" : "2002", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "ĐTVT" },
{ "STT" : 5, "Tên ứng viên" : "Phan Đức Anh", "Năm sinh" : "2001", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 6, "Tên ứng viên" : "Nguyễn Đức Dương", "Năm sinh" : "2000", "Trường" : "ĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 7, "Tên ứng viên" : "Tạ Hữu Bình", "Năm sinh" : "2001", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 8, "Tên ứng viên" : "Nguyễn Nhật Trường", "Năm sinh" : "2001", "Trường" : "ĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Truyền thông và mạng máy tính" },
{ "STT" : 9, "Tên ứng viên" : "Đinh Thị Hường", "Năm sinh" : "2000", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 10, "Tên ứng viên" : "Trần Quang Hải", "Năm sinh" : "2001", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Công nghệ thông tin Global ICT" },
{ "STT" : 11, "Tên ứng viên" : "Nguyễn Tuấn Hiệp", "Năm sinh" : "2001", "Trường" : "HV CNBCVT", "Chuyên ngành" : "Kỹ thuật viễn thông" },
{ "STT" : 12, "Tên ứng viên" : "Nguyễn Xuân Khang", "Năm sinh" : "2001", "Trường" : "ĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Hệ thống thông tin" },
{ "STT" : 13, "Tên ứng viên" : "Trịnh Hồng Phượng", "Năm sinh" : "2001", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Khoa học máy tính" },
{ "STT" : 14, "Tên ứng viên" : "Đỗ Triệu Hải", "Năm sinh" : "2000", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Kỹ thuật Cơ điện tử" },
{ "STT" : 15, "Tên ứng viên" : "Bùi Doãn Đang", "Năm sinh" : "2000", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "Hệ thống thông tin quản lý" },
{ "STT" : 16, "Tên ứng viên" : "Nguyễn Thị Hương", "Năm sinh" : "2000", "Trường" : "ĐH Bách khoa Hà Nội", "Chuyên ngành" : "ĐTVT" },
{ "STT" : 17, "Tên ứng viên" : "Trần Thanh Hiền", "Năm sinh" : "2001", "Trường" : "Học viện Kỹ thuật Mật mã", "Chuyên ngành" : "ATTT" },
{ "STT" : 18, "Tên ứng viên" : "Đỗ Hoàng Sơn", "Năm sinh" : "2000", "Trường" : "HV CNBCVT", "Chuyên ngành" : "ATTT" },
{ "STT" : 19, "Tên ứng viên" : "Vũ Thị Huyền", "Năm sinh" : "2001", "Trường" : "ĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Mạng máy tính và truyền thông dữ liệu" },
{ "STT" : 20, "Tên ứng viên" : "Phùng Hoàng Long", "Năm sinh" : "2000", "Trường" : "HV CNBCVT", "Chuyên ngành" : "Hệ thống thông tin" },
{ "STT" : 21, "Tên ứng viên" : "Phạm Đình Phú", "Năm sinh" : "2000", "Trường" : "ĐH GTVT", "Chuyên ngành" : "Kỹ thuật thông tin và truyền thông" },
{ "STT" : 21, "Tên ứng viên" : "Phạm Đình Phú", "Năm sinh" : "2000", "Trường" : "ĐH GTVT", "Chuyên ngành" : "Kỹ thuật thông tin và truyền thông" },
{ "STT" : 22, "Tên ứng viên" : "Kiều Sơn Tùng", "Năm sinh" : 2001, "Trường" : "ĐH Kinh tế Quốc dân", "Chuyên ngành" : "Khoa học dữ liệu trong kinh tế và kinh doanh" },
{ "STT" : 23, "Tên ứng viên" : "Hoàng Thị Vân Anh", "Năm sinh" : 2001, "Trường" : "Học viện Kỹ thuật Mật mã", "Chuyên ngành" : "ATTT" },
{ "STT" : 24, "Tên ứng viên" : "Nguyễn Tấn Huy", "Năm sinh" : 2001, "Trường" : "HĐH Công nghệ - ĐH Quốc gia Hà Nội", "Chuyên ngành" : "Điện" }
]);
```
### 7. Viết file tạo trang web:
Đầu tiên ta tạo file ```requiriments.txt```
```
vi app/requirements.txt
```
Thêm nội dung vào:
```
flask
pymongo
```
Tiếp đến ta xây dựng ```app.py``` bao gồm Flask app trong mục ```app```:
```
vi app/app.py
```
Ta thêm code vào file:
```
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
Hàm ```get_db()``` giúp ta truy cập vào database và lấy danh sách lớp, tiếp đến ta xây dựng file ```index.html``` cơ bản để hiển thị danh sách trên trình duyệt.
```
vi templates/index.html
```
Thêm đoạn code phía dưới vào
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FlaskApp</title>
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
        <tr><td>STT</td><td>Tên ứng viên</td><td>Năm sinh</td><td>Trường</td><td>Chuyên ngành</td></tr>
        {% for todo in todos %}
        <tr><td> {{ todo['STT'] }} </td><td> {{ todo['Tên ứng viên']}} </td><td> {{ todo['Năm sinh']}} </td><td> {{ todo['Trường']}} </td><td> {{ todo['Chuyên ngành']}} </td></tr>
            <!--<p>{{ todo['STT'] }} <i>{{ todo['Tên ứng viên']}}</i> <i>{{ todo['Năm sinh']}}</i> <i>{{ todo['Trường']}}</i> <i>{{ todo['Chuyên ngành']}}</i></p> -->
        {% endfor %}
    </table>
    </div>
```
Cuối cùng là tạo file ```wsgi.py``` để có thể chạy ```Gunicorn```
```
vi app/wsgi.py

from app import application

if __name__ == "__main__":
  application.run()
```

### 8. Viết Dockerfile cho Flask và Webserver

#### Dockerfile cho Flask
Với Docker, nếu muốn build một container ta cần tạo file ```Dockerfile```. ```Dockerfile``` là một công cụ giúp ta có thể xây dựng ```image``` cấu hình theo yêu cầu của chúng ta. Trong bước này ta sẽ viết ```Dockerfile``` cho ```flask```

Ta tạo ```Dockerfile cho Flask trong thư mục ```app```:
```
   vi app/Dockerfile
```
Thêm đoạn cấu hình dưới đây vào:
```
FROM python:3.9

WORKDIR /var/www

COPY . var/wwww

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn


EXPOSE 5000

CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi"]
```
Đâu tiên ta xác định base image,```Dockerfile``` này được chạy trên ```image:python3.9```. Tiếp theo ta xác định ```WORKDIR``` và ```COPY``` các file cần thiết để chạy app. File ```requirement``` chứa các thư viện cần thiết kèm với đó là ```gunicorn``` để có thể sử dụng ```nginx``` cuối cùng xác định ```port``` mà flask expose và chạy ```CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi"] ``` để khởi động máy chủ ```gunicorn``` hoạt động trên ```port:5000```.

#### Dockerfile cho nginx
Tạo ```Dockerfile``` cho ```nginx```
```
   vi nginx/Dockerfile
```
Ta thêm đoạn code dưới đây để tạo ```Dockerfile``` xây dựng Nginx server trong thư mục nginx:
```
FROM nginx:1.22.0-alpine


COPY conf.d/app.conf /etc/nginx/conf.d/app.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```
Với ```Nginx``` ta sử dụng based image là ```nginx:1.22.0-alpine ``` đã được xây dựng môi trường và cấu hình sẵn, ta chỉ cần ```COPY``` app.conf vào trong container. Dịch vụ ```Nginx``` sẽ chạy qua cổng ```:80``` với ```:433``` là cổng an toàn.
Dòng lệnh ```CMD ["nginx", "-g", "daemon off;"] ``` để khởi chạy ```Nginx server```. 
Vậy là ta đã hoàn thành các file ```Dockerfile``` cần thiết.

### 9. Tạo file Docker-compose
```
vi docker-compose.yml
```
Ta thêm đoạn code dưới đây để tạo ```Docker-compose```
```
version: '3'
services:

  flask:
    build:
      context: app
      dockerfile: Dockerfile
    container_name: flask
    restart: unless-stopped
    image: python3.9
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

  mongodb:
    image: mongo:5.0.0
    container_name: mongodb
    restart: unless-stopped
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
Ta sử dụng ```container_name``` để xác định tên container, thuộc tính ```image``` xác định tên image Docker gắn thẻ, ```restart``` khởi động lại khi container bị dừng, ```volumes``` mount dữ liệu trên host và container, ```depends_on``` giúp ta chắc chắn rằng flask chỉ chạy khi mongodb chạy cuối cùng là ```networks``` để xác định những gì flask sẽ truy cập đến.

Với dịch vụ ```flask``` được định nghĩa như trên, ta bắt đầu xây dựng cấu hình cho mongodb
Ta cấu hình mongodb như trên với ```enviroment``` giúp ta tạo user trong mongo, dữ liệu danh sách lớp được lấy từ file ```init-db.js``` mà ta sẽ xây dựng ở phần sau. Ta để ```ports``` kết nối qua cổng 27017 trên máy host và ```networks``` là backend

Cuối cùng ta cấu hình webserver cho ứng dụng.
Ở đây ta sử dụng nginx làm webserver và base image là ```nginx:1.22.0-alpine```. Dịch vụ nginx sẽ chạy qua 2 cổng là ```:80``` và ```:433``` và ```volumes``` được mount tới ```/var/log/nginx/.``` cùng với đó xác định ```depends_on``` là flask và ```networks``` là backend.

Cuối cùng ta xác định ```networks``` và ```volumes```:

### 10. Running Container
```
docker-compose up -d
```
<img src= images/dockercomup.png>

```
docker ps
```
<img src= images/dockerps.png>

Okey cuối cùng cũng xong, vào 0.0.0.0 để check kết quả rồi đi uống beer :>

<img src= images/result.png>

## III. References
- [How To Set Up Flask with MongoDB and Docker](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker)
- [Docker ARG vs ENV](https://vsupalov.com/docker-arg-vs-env/)
- [Docker COPY vs ADD](https://helpex.vn/question/su-khac-biet-giua-cac-lenh-copy-va-add-trong-dockerfile-la-gi-5cb0222eae03f645f42023ef)
- [Docker CMD vs ENTRYPOINT](https://www.bmc.com/blogs/docker-cmd-vs-entrypoint/#:~:text=CMD%20vs%20ENTRYPOINT%3A%20Fundamental%20differences&text=CMD%20commands%20are%20ignored%20by,as%20arguments%20of%20the%20command.)
