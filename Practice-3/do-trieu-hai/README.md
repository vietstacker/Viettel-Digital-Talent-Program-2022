

Docker file
Dockerfile instructions
...
What are differences between:
 - ARG vs ENV :
 ENV được dùng để chạy các containers
 ARG được dùng để xây dựng Docker image
  ARG :
   - ARG không khả dụng sau khi image đã được build . Một container đang chạy sẽ không có quyền truy cập vào giá trị biến ARG.
  ENV :
   - ENV chủ yếu nhằm cung cấp các giá trị mặc định cho các biến môi trường sẽ được chạy.các dockerized app khi chạy có thể truy cập các biến môi trường đó .
 - COPY vs ADD :Mặc dù ADD và COPY giống nhau về chức năng, nhưng nói chung, COPY được ưu tiên hơn. Đó là vì nó rõ ràng hơn ADD
  - COPY: Hỗ trợ cơ bản sao chép file từ các localfile vào trong container
  - ADD: Có thêm đặc điểm hỗ trợ nạp các gói trên URL
 - CMD vs ENTRYPOINT :
  - CMD : Chạy các sorfware được chứa trong image với các argument. trong nhiều trường hợp CMD chạy các lệnh môi trường
  - ENTRYPOINT :Chạy lệnh chính của image

