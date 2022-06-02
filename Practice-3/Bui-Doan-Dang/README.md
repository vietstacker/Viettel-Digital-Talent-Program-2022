# DOCKER

## What are the differences between these instructions?

### *ARG* và *ENV*

**- ARG** hay còn gọi là biến build-time chỉ hoạt động trong quá trình build-image, hoạt động kể từ thời điểm chúng được khai báo trong Dockerfile trong câu lệnh ARG cho đến khi image được tạo. Khi chạy container, chúng ta không thể truy cập giá trị của các biến ARG và chúng chạy duới giá trị mặc định, nếu thay đổi lệnh build sẽ lỗi.

**- ENV** có sẵn trong quá trình xây dựng, ngay khi bạn khai báo chúng với một command của ENV. Tuy nhiên, không giống như ARG, khi build xong image, các container chạy image có thể truy cập giá trị ENV này.Bên cạnh đó các container chạy từ image có thể ghi đè giá trị của ENV.

### *COPY* và *ADD*

Lệnh **COPY** sẽ sao chép các tệp mới từ <src> và thêm chúng vào hệ thống tệp của bộ chứa tại đường dẫn <dest>

```
  COPY <src> <dest>
```
 Lệnh **ADD** cũng sao chép các tệp mới từ <src> và thêm chúng vào hệ thống tệp của bộ chứa tại đường dẫn <dest>
 ```
  ADD ["< src >",... "< dest >"] 
```
Nhìn chung **COPY** và **ADD** khá tương tự nhau về mặt chức năng, xong chúng vẫn có những diểm khác nhau cơ bản.
 
**- COPY** sao chép một tập tin / thư mục từ máy chủ của bạn vào image.

**- ADD** sao chép một tập tin / thư mục từ máy chủ vào image, nhưng cũng có thể tìm nạp các URL từ xa, trích xuất các tệp TAR, v.v ... 

### *CMD* và *
  
  
