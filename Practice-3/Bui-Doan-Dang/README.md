# DOCKER
## Docker và Docker-compose


## What are the differences between these instructions?

### *ARG* và *ENV*

-** ARG** hay còn gọi là biến build-time chỉ hoạt động trong quá trình build-image, hoạt động kể từ thời điểm chúng được khai báo trong Dockerfile trong câu lệnh ARG cho đến khi image được tạo. Khi chạy container, chúng ta không thể truy cập giá trị của các biến ARG và chúng chạy duới giá trị mặc định, nếu thay đổi lệnh build sẽ lỗi.

-** ENV** có sẵn trong quá trình xây dựng, ngay khi bạn khai báo chúng với một command của ENV. Tuy nhiên, không giống như ARG, khi build xong image, các container chạy image có thể truy cập giá trị ENV này.Bên cạnh đó các container chạy từ image có thể ghi đè giá trị của ENV.

### *COPY* và *ADD*

Lệnh **COPY** sẽ sao chép các tệp mới từ src và thêm chúng vào hệ thống tệp của bộ chứa tại đường dẫn dest
```
  COPY <src> <dest>
```
 Lệnh **ADD** cũng sao chép các tệp mới từ src và thêm chúng vào hệ thống tệp của bộ chứa tại đường dẫn dest
 ```
  ADD ["< src >",... "< dest >"] 
```
Nhìn chung **COPY** và **ADD** khá tương tự nhau về mặt chức năng, xong chúng vẫn có những diểm khác nhau cơ bản.
 
-** COPY** sao chép một tập tin / thư mục từ máy chủ của bạn vào image.

-** ADD** sao chép một tập tin / thư mục từ máy chủ vào image, nhưng cũng có thể tìm nạp các URL từ xa, trích xuất các tệp TAR, v.v ... 

### *CMD* và *ENTRYPOINT*
Cả hai lệnh (**CMD** và **ENTRYPOINT**) có thể được chỉ định ở dạng shell form hoặc dạng exec form.
- Dạng shell form 
```
<instruction> <command>
```
- Dạng exec form
```
<instruction> ["executable", "param1", "param2", ...]
```
Thoạt nhìn, chúng đều được sử dụng để chỉ định và thực thi các lệnh nhưng chúng cũng có những điểm khác nhau.
- **CMD** cho phép ta set default command, có nghĩa là command này sẽ chỉ được chạy khi run container mà không chỉ định một command. CMD thì tất cả sẽ bị ignore ngoại trừ lệnh CMD cuối cùng.
- **ENTRYPOINT** cho phép ta cấu hình container sẽ chạy dưới dạng thực thi. Nó tương tự như CMD, vì nó cũng cho phép ta chỉ định một lệnh với các tham số. Sự khác biệt là lệnh ENTRYPOINT và các tham số không bị ignore khi Docker container chạy.

## Xây dựng Docker-compose đóng gói và chạy webapp

### Yêu cầu:
Thiết lập ứng dụng web 3 tầng hiển thị thông tin sinh viên trong lớp học trên trình duyệt bằng Docker-compose. Dựa trên các base-image:
• nginx:1.22.0-alpine
• python:3.9
• mongo:5.0
### Chuẩn bị
Để cài đặt được webapp ta cần chuẩn bị: 
- Máy chủ để build image
- Docker và kiến thức về Docker [(Hướng dẫn cài đặt)](https://vsudo.net/blog/docker-ubuntu.html)
- Docker-compose và kiến thức về Docker-compose [(Hướng dẫn cài đặt)](https://thuanbui.me/huong-dan-cai-dat-docker-docker-compose-tren-ubuntu-20-04/)
Cấu trúc file sẽ gòm có:
```bash
__ project-name
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
### Tiến hành xây dựng
#### Bước 1: Viết cấu hình cho file Docker-compose

<p>File <code>docker-compose.yml</code> cho phép ta xây dựng hạ tầng một ứng dụng web bao gồm webserver, app, database một cách riêng lẻ. Các dịch vụ có thể kết nối với nhau và có volume riêng để lưu trữ</p>
Để bắt đầu, hãy tạo một thư mục cho ứng dụng trong thư mục chính trên máy chủ:
<pre class="prefixed command language-bash"><code><ol><li data-prefix="$"><span class="token function">mkdir</span> flaskapp
</li></ol>
</code></pre>





## Nguồn tham khảo
- [Docker ARG, ENV và .env ](https://viblo.asia/p/docker-arg-env-va-env-XL6lA4zmZek)
- [Docker - CMD vs ENTRYPOINT](https://www.atatus.com/blog/docker-cmd-vs-entrypoints/)
- [HaManhDong-ansible](https://github.com/HaManhDong/ansible/blob/master)

  
  
