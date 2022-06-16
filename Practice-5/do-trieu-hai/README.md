# **Practice 5: Elasticsearch**

## **I. Elasticsearch là gì?**
**Elasticsearch** là một công cụ tìm kiếm dựa trên nền tảng `Apache Lucene`. Nó cung cấp một bộ máy tìm kiếm dạng phân tán, có đầy đủ công cụ với một giao diện web HTTP có hỗ trợ dữ liệu JSON.

<img src="./imgs/what is ES.png">

- `Elasticsearch` là một `search engine`
- `Elasticsearch` được kế thừa từ Lucene Apache
- `Elasticsearch` thực chất hoặt động như 1 web server, có khả năng tìm kiếm nhanh chóng (near realtime) thông qua giao thức RESTful
- `Elasticsearch` có khả năng phân tích và thống kê dữ liệu
- `Elasticsearch` chạy trên server riêng và đồng thời giao tiếp thông qua RESTful do vậy nên nó không phụ thuộc vào client viết bằng gì hay hệ thống hiện tại của bạn viết bằng gì. Nên việc tích hợp nó vào hệ thống bạn là dễ dàng, bạn chỉ cần gửi request http lên là nó trả về kết quả.
- `Elasticsearch` là 1 hệ thống phân tán và có khả năng mở rộng tuyệt vời (horizontal scalability). Lắp thêm node cho nó là nó tự động auto mở rộng cho bạn.
- `Elasticsearch` là 1 open source được phát triển bằng Java

## **II. Cách làm việc của ES**

<img src="./imgs/ESwork.png">

ES là 1 server riêng biệt được tạo ra chuyên để tìm kiếm dữ liệu (nghe gần giống DataBase) nhưng kiểu tìm kiếm theo kiểu khác.

ES chạy 1 cổng riêng biệt (local default là 9200)

Trong khi truy vấn sử dụng câu lệnh LIKE `"%abc%"` thì kết quả chỉ cần chứa `"abc"` là sẽ ra. Ví dụ `"abcxyz"`,`"noabc"`...nói chung là sẽ ra 1 đống thứ tùm lum. Còn search bằng ES gõ nào thì chỉ tìm thằng đó thôi không thêm nếm gì cả. ES `đánh index` (thuật ngữ sễ được nói rõ trogn phần sau) để tìm.

## **III. Khái niệm cần biết về ES**
### **1. Document**
**Document** là một` JSON object` với một số dữ liệu. Đây là `basic information unit` trong ES. Hiểu 1 cách cơ bản thì đây là đơn vị nhỏ nhất để lưu trữ dữ liệu trong Elasticsearch.

### **2. Index**

Trong Elasticsearch , sử dụng một cấu trúc được gọi là **inverted index** . Nó được thiết kế để cho phép tìm kiếm `full-text search`. Cách thức của nó khá đơn giản, các văn bản được phân tách ra thành từng từ có nghĩa sau đó sẽ được map xem thuộc văn bản nào. Khi search tùy thuộc vào loại search sẽ đưa ra kết quả cụ thể.

Ví dụ : Chúng ta có 2 văn bản cụ thể như sau :

> 1, ES tìm kiếm bằng inverted index

> 2, DB tìm kiếm bằng index

Để tạo ra một `inverted index`, trước hết chúng ta sẽ phân chia nội dung của từng tài liệu thành các từ riêng biệt (chúng ta gọi là `terms`), tạo một danh sách được sắp xếp của tất cả `terms` duy nhất, sau đó liệt kê tài liệu nào mà mỗi thuật ngữ xuất hiện. Kết quả như sau:

|Term | Câu 1 | Câu 2 |
|---|---|---|
|ES | x | |
|DB | | x |
|tìm | x | x |
|kiếm | x | x |
|bằng | x | x |
|inverted | x | |
|index | x | x |

Bây giờ, nếu chúng ta muốn tìm kiếm inverted index, chúng ta chỉ cần tìm trong các tài liệu trong đó mỗi thuật ngữ có xuất xuất hiện hay không. Kết quả như sau:

|Term | Câu 1 | Câu 2 |
|---|---|---|
|inverted | x | |
|index | x | x |
|---|---|---|
|Total| 2 | 1 |

Như các bạn đã thấy, cả 2 câu đều thích hợp với từ khóa. Tuy nhiên có thể dễ dàng nhận ra rằng `Câu 1` chính xác hơn nhiều.

### **3. Shard**

- **Shard** là đối tượng của `Lucene` , là tập con các `documents` của `1 Index`. Một `Index` có thể được chia thành nhiều `shard`.
- Mỗi `node` bao gồm nhiều `Shard` . Chính vì thế `Shard` mà là đối tượng nhỏ nhất, hoạt động ở mức thấp nhất, đóng vai trò lưu trữ dữ liệu.
- Chúng ta gần như không bao giờ làm việc trực tiếp với các `Shard` vì Elasticsearch đã support toàn bộ việc giao tiếp cũng như tự động thay đổi các `Shard` khi cần thiết.
- Có 2 loại `Shard` là : **primary shard** và **replica shard**.

**a. Primary Shard**
- `Primary Shard` là sẽ lưu trữ dữ liệu và đánh index . Sau khi đánh xong dữ liệu sẽ được vận chuyển tới các `Replica Shard`.
- Mặc định của Elasticsearch là mỗi index sẽ có 5 `Primary shard` và với mỗi `Primary shard` thì sẽ đi kèm với 1 `Replica Shard`.

**b. Replica Shard**
- `Replica Shard` đúng như cái tên của nó, nó là nơi lưu trữ dữ liệu nhân bản của `Primary Shard`
- `Replica Shard` có vai trò đảm bảo tính toàn vẹn của dữ liệu khi `Primary Shard` xảy ra vấn đề.
- Ngoài ra `Replica Shard` có thể giúp tăng cường tốc độ tìm kiếm vì chúng ta có thể setup lượng `Replica Shard` nhiều hơn mặc định của ES

### **4. Node**
- Là trung tâm hoạt động của Elasticsearch. Là nơi lưu trữ dữ liễu ,tham gia thực hiện đánh index của `cluster` cũng như thực hiện các thao tác tìm kiếm
- Mỗi node được định danh bằng 1 `unique name`

### **5. Cluster**

- Tập hợp các nodes hoạt động cùng với nhau, chia sẽ cùng thuộc tính `cluster.name`. Chính vì thế `Cluster` sẽ được xác định bằng 1 `unique name`. Việc định danh các cluster trùng tên sẽ gây nên lỗi cho các node vì vậy khi setup các bạn cần hết sức chú ý điểm này
- Mỗi `cluster` có một node chính (master), được lựa chọn một cách tự động và có thể thay thế nếu sự cố xảy ra. Một `cluster` có thể gồm 1 hoặc nhiều `node`s. Các `nodes `có thể hoạt động trên cùng 1 `server` .
- Tuy nhiên trong thực tế , một `cluster` sẽ gồm nhiều `nodes` hoạt động trên các `server` khác nhau để đảm bảo nếu 1 `server` gặp sự cố thì `server` khác (node khác) có thể hoạt động đầy đủ chức năng so với khi có 2 `servers`. Các `node` có thể tìm thấy nhau để hoạt động trên cùng 1 `cluster` qua giao thức `unicast`.

##  **IV. Ưu nhược điểm của ES**
### **1. Ưu điểm**
- Tìm kiếm dữ liệu rất nhanh chóng, mạnh mẽ dựa trên Apache Lucene ( near-realtime searching)
- Có khả năng phân tích dữ liệu (Analysis data)
- Khả năng mở rộng theo chiều ngang tuyệt “vòi”
- Hỗ trợ tìm kiếm mờ (fuzzy), tức là từ khóa tìm kiếm có thể bị sai lỗi chính tả hay không đúng cú pháp thì vẫn có khả năng elasticsearch trả về kết quả tốt.
- Hỗ trợ Structured Query DSL (Domain-Specific Language ), cung cấp việc đặc tả những câu truy vấn phức tạp một cách cụ thể và rõ ràng bằng JSON.
- Hỗ trợ nhiều Elasticsearc client như Java, PhP, Javascript, Ruby, .NET, Python
### **2. Nhược điểm**
- Elasticsearch được thiết kế cho mục đích search, do vậy với những nhiệm vụ khác ngoài search như CRUD thì elastic kém thế hơn so với những database khác như Mongodb, Mysql …. Do vậy người ta ít khi dùng elasticsearch làm database chính, mà thường kết hợp nó với 1 database khác.
- Trong elasticsearch không có khái niệm database transaction , tức là nó sẽ không đảm bảo được toàn vẹn dữ liệu trong các hoạt độngInsert, Update, Delete.Tức khi chúng ta thực hiện thay đổi nhiều bản ghi nếu xảy ra lỗi thì sẽ làm cho logic của mình bị sai hay dẫn tới mất mát dữ liệu. Đây cũng là 1 phần khiến elasticsearch không nên là database chính.
- Không thích hợp với những hệ thống thường xuyên cập nhật dữ liệu. Sẽ rất tốn kém cho việc đánh index dữ liệu.

## **V. Tham khảo**
[**Nguồn tham khảo chính**](https://topdev.vn/blog/elasticsearch-la-gi/)
