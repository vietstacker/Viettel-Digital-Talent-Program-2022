# 1. PHÂN BIỆT CÁC INSTRUCTION

## 1.1. ARG vs ENV

Cả ARG và ENV đều là các instruction dùng để define các biến trong Docker tuy nhiên, phạm vi các biến khai bảo bởi 2 instruction này là khác nhau.

> ENV dùng để khai bao các biển dùng khi chạy container trong tương lai còn ARG dùng cho quá trình building image.

Cụ thể:

- ENV được sử dụng khi để define các biến môi trường mà các app chạy container sẽ truy cập được các biến này. Thường thì các biến này sẽ được dùng để configure các app chạy trong container.
- ARG được sử dụng để define các biến mà sau khi build xong image sẽ không sử dụng được các biến này nữa.

![docker-env-vs-arg](images/docker-var-vs-arg.webp)

Tuy nhiên, ENV cũng có thể được sử dụng trong quá trình build image. Ta có thể override biến ARG khi build image bằng --build-arg và override biến ENV bằng -e khi run container.

Để khai báo một biến ENV hoặc ARG ta sử dụng:

        ENV variable_name=value
        ARG variable_name=value

Để sử dụng một biến ENV hoặc ARG ta sử dụng:

        ${var_name}

Ta có thể chỉ định giá trị mới (thay vì giá trị khai báo trong Dockerfile) của biến ARG khi build image bằng cách override bằng --build-arg nhưng không thể làm như vậy với biến ENV, nhưng ta có thể thay đổi bằng cách set biến ENV bằng 1 biến ARG như sau:

        ARG var_1 = value
        ENV var_2 = ${var_1}

## 1.2. COPY vs ADD

COPY và ADD đều có tính năng tương tự nhau đó là copy file từ local vào trong container. Điểm khác chính là ADD hỗ trợ thêm 2 tính năng là local-only tar extraction và fetch packages from remote URLs.

Về cơ bản thì COPY được khuyên dùng hơn do nó dễ hiểu và rõ ràng hơn. ADD được sử dụng trong các trường hợp ta cần extract file tar trong container.

Nếu ta có Dockerfile sử dụng nhiều file thì lệnh COPY nên được dùng riêng ra thay vi copy hết tất cả các file. Điều này sẽ tận dụng được việc caching khi mà các file riêng lẻ không có sự thay đổi.

Ta không nên sử dụng lệnh ADD để fetch các packages từ remote URL, thay vào đó ta nên sử dụng curl hoặc wget để xoá được các packeage không cần thiết sau khi đã extract và không bị mất thêm một layer cho lệnh ADD, ví dụ, thay vì sử dụng:

    ADD https://example.com/big.tar.xz /usr/src/things/
    RUN tar -xJf /usr/src/things/big.tar.xz -C /usr/src/things
    RUN make -C /usr/src/things all

Ta có thể dùng curl:

    RUN mkdir -p /usr/src/things \
        && curl -SL https://example.com/big.tar.xz \
        | tar -xJC /usr/src/things \
        && make -C /usr/src/things all

## 1.3. CMD vs ENTRYPOINT

CMD và ENTRYPOINT đều dùng để định ra program mà ta muốn execute khi mà ta chạy docker run.

Điểm khác nhau giữa CMD và ENTRYPOINT đó là ENTRYPOINT sẽ configure khi run container như một lệnh (executable), nói cách khác mọi biến được define sau tên của image sẽ được append vào lệnh trong ENTRYPOINT như một biến còn đối với CMD thì khi ta thêm vào đằng sau tên image của lệnh docker run image thì nó sẽ override lệnh CMD này (do CMD chỉ là lệnh default sẽ được chạy khi docker run), ví dụ:

        FROM ubuntu

        CMD  ["echo", "Hello World"]

Khi ta build và chạy image này output sẽ là Hello world. Khi ta thêm arg vào docker run như sau:

        docker run test echo "Vietnam"

Output sẽ là Vietnam thay vì Hello World (do lệnh CMD sẽ bị override):

![docker-cmd](images/docker-cmd.png)

Đối với ENTRYPOINT thì các arguments được thêm vào sau docker run sẽ chỉ được append vào sau lệnh ENTRYPOINT. Ví dụ:

        FROM ubuntu
        ENTRYPOINT ["echo", "Hello World"]

Vậy khi ra chạy docker run test "Hi" thì "Hi" sẽ được append vào lệnh echo "Hello World" thay vì override:

![entrypoint-append](images/entrypoint-append.png)

Nếu ta thêm echo "Hi" vào thì sẽ như thế nào, rõ ràng lệnh này sẽ bị output Hello world echo Hi do khi append thì nó sẽ thành echo "Hello World" echo "Hi", khi này ["Hello World", "echo", "Hi"] sẽ là argument của lệnh echo:

![entrypoing-check-override](images/entrypoint-check-override.png)

Một điểm đặc biệt nữa là khi mà CMD không khai báo ở dạng [arg1, agr2] mà không phải CMD cmd agr1... hoặc CMD ["executable","arg1",...] thì nó sẽ được coi như là default argument cho ENTRYPOINT. Như vậy khi mà ta không thêm argument vào sau docker run image thì CMD sẽ được sử dụng. Ngược lại thì CMD sẽ bị override khi ta specify biến sau docker run image.
