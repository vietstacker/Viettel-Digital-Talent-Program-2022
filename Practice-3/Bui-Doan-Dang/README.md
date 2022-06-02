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
  ADD <src> <dest>
```
 Nhìn chung **COPY** và **ADD** khá tương tự nhau về mặt chức năng, xong chúng vẫn có những diểm khác nhau cơ bản:
 
  <code><span class="pln">__ project</span><span class="pun">-</span><span class="pln">name
    </span><span class="pun">|</span><span class="pln">__ </span><a href="https://developpaper.com/tag/docker/" title="View all posts in docker" target="_blank"><span class="pln">docker</span></a><span class="pun">-</span><span class="pln">file
        </span><span class="pun">|</span><span class="pln">__ ningx
            </span><span class="pun">|</span><span class="pln">__ </span><span class="typ">Dockerfile</span><span class="pln">
            </span><span class="pun">|</span><span class="pln">__ conf
                </span><span class="pun">|</span><span class="pln">__ </span><a href="https://developpaper.com/tag/nginx/" title="View all posts in nginx" target="_blank"><span class="pln">nginx</span></a><span class="pun">.</span><span class="pln">conf
        </span><span class="pun">|</span><span class="pln">__ flask
            </span><span class="pun">|</span><span class="pln">__ </span><span class="typ">Dockerfile</span><span class="pln">
            </span><span class="pun">|</span><span class="pln">__ requirements</span><span class="pun">.</span><span class="pln">txt
        </span><span class="pun">|</span><span class="pln">__ mongo
            </span><span class="pun">|</span><span class="pln">__ </span><span class="typ">Dockerfile</span><span class="pln">
            </span><span class="pun">|</span><span class="pln">__ setup</span><span class="pun">.</span><span class="pln">sh
        </span><span class="pun">|</span><span class="pln">__ docker</span><span class="pun">-</span><span class="pln">compose</span><span class="pun">.</span><span class="pln">yml
    </span><span class="pun">|</span><span class="pln">__ src
        </span><span class="pun">|</span><span class="pln">__ app
            </span><span class="pun">|</span><span class="pln">__ </span><span class="pun">...</span><span class="pln">
        </span><span class="pun">|</span><span class="pln">__ run</span><span class="pun">.</span><span class="pln">py</span></code>
  
