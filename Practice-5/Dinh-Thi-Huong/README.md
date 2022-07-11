# Learn About Elasticsearch

# Table of contents
- [What is Elasticsearch?](#what-is-elasticsearch)
- [Fundamental Concepts](#fundamental-concepts)
- [Features](#features)
- [Pros and Cons](#pros-and-cons)
- [References](#references)


---
# What is Elasticsearch?

![image](https://hocdevops.com/wp-content/uploads/2021/07/1_Co95dG0NmGfL-vGMSBtLWQ.png)

Elasticsearch is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents. 


Elasticsearch is developed in Java and is dual-licensed under the source-available Server Side Public License and the Elastic license, while other parts fall under the proprietary (source-available) Elastic License. Official clients are available in Java, .NET (C#), PHP, Python, Apache Groovy, Ruby and many other languages. According to the DB-Engines ranking, Elasticsearch is the most popular enterprise search engine.


Elasticsearch is developed alongside the data collection and log-parsing engine Logstash, the analytics and visualization platform Kibana, and the collection of lightweight data shippers called Beats. The four products are designed for use as an integrated solution, referred to as the "Elastic Stack" (Formerly the "ELK stack", short for "Elasticsearch, Logstash, Kibana".)

![image](https://i2.wp.com/tunghuynh.net/wp-content/uploads/2021/01/logstash-architecture-1.jpeg?fit=1140%2C600&ssl=1)

Beside ELK stack, another popular centralized logging solution is the EFK stack which stands for **E**lasticsearch, **F**luentd and **K**ibana. Fluentd plays as a data collector that collect, transform, and deliver log data to the Elasticsearch.

![image](https://miro.medium.com/max/906/1*jr0cpmzt4pzLv_iU53nTdw.jpeg)

---
# Fundamental Concepts

### 1. Index

When a document is stored, it is indexed. Elasticsearch uses a data structure called an **inverted index** that supports very fast full-text searches. An inverted index lists every unique word that appears in any document and identifies all of the documents each word occurs in.


An **index** can be thought of as an optimized collection of documents and each document is a collection of fields, which are the key-value pairs that contain your data. By default, Elasticsearch indexes all data in every field and each indexed field has a dedicated, optimized data structure. For example, text fields are stored in inverted indices, and numeric and geo fields are stored in BKD trees. The ability to use the per-field data structures to assemble and return search results is what makes Elasticsearch so fast.


Elasticsearch also has the ability to be schema-less, which means that documents can be indexed without explicitly specifying how to handle each of the different fields that might occur in a document.


### 2. Mapping
Mapping is the process of defining how a document and its fields are stored and indexed.


You can define rules to control dynamic mapping and explicitly define mappings to take full control of how fields are stored and indexed.


### 3. Sharp
Shard is an object of Lucene , which is a subset of documents of an Index. An Index can be split into multiple shards.


Each node consists of many Shards. Therefore, Shard which is the smallest object, operating at the lowest level, plays the role of data storage.


We almost never work directly with Shards because Elasticsearch already supports all communication and automatically changes Shards as needed.

### 4. Node
Node is the center of operations of Elasticsearch. As a place to store data, participate in indexing of the cluster as well as performing search operations.


Each node is identified with a unique name.

### 5. Cluster

Cluster is a collection of nodes that work together, sharing the same `cluster.name` property.


Each cluster has a master node, which is automatically selected and can be replaced if problems occur. 


A cluster can consist of 1 or more nodes. Nodes can operate on the same server. However, in reality, a cluster will consist of many nodes operating on different servers to ensure that if one server fails, the other server (other node) can function fully compared to when there are 2 servers.


When you have multiple Elasticsearch nodes in a cluster, stored documents are distributed across the cluster and can be accessed immediately from any node.

![image](https://www.loggly.com/wp-content/uploads/2016/08/Scaling-Elasticsearch-Mulitcluster-Architecture-700x390.jpg)

### 6. Full-text search
Full-text search refers to techniques for searching a single computer-stored document or a collection in a full-text database. Full-text search is distinguished from searches based on metadata or on parts of the original texts represented in databases (such as titles, abstracts, selected sections, or bibliographical references).


In a full-text search, a search engine examines all of the words in every stored document as it tries to match search criteria (for example, text specified by a user). 


### 7. Fuzzy search
Fuzzy matching treats two words that are “fuzzily” similar as if they were the same word. First, we need to define what we mean by fuzziness.

Elasticsearch supports a maximum edit distance, specified with the fuzziness parameter, of 2. The fuzziness parameter can be set to AUTO, which results in the following maximum edit distances:
- 0 for strings of one or two characters
- 1 for strings of three, four, or five characters
- 2 for strings of more than five characters

You may find that an edit distance of 2 returns results that don’t appear to be related.

---
# Features
![image](https://static.javatpoint.com/tutorial/elasticsearch/images/elasticsearch-features.png)

Elasticsearch can be used to search and analytics for all types of data. It provides scalable search, has near real-time search, and supports multitenancy. 


"Elasticsearch is distributed, which means that indices can be divided into shards and each shard can have zero or more replicas. Each node hosts one or more shards and acts as a coordinator to delegate operations to the correct shard(s). Rebalancing and routing are done automatically".


Related data is often stored in the same index, which consists of one or more primary shards, and zero or more replica shards. Once an index has been created, the number of primary shards cannot be changed.


Elasticsearch offers speed and flexibility to handle data in a wide variety of use cases:
- Add a search box to an app or website
- Store and analyze logs, metrics, and security event data
- Use machine learning to automatically model the behavior of your data in real time
- Automate business workflows using Elasticsearch as a storage engine
- Manage, integrate, and analyze spatial information using Elasticsearch as a geographic information system (GIS)
- Store and process genetic data using Elasticsearch as a bioinformatics research tool

---
# Pros and Cons

### 1. Pros

- Speedy, powerful data search based on Apache Lucene (near-realtime searching)

- Ability to analyze data

- Excellent horizontal scalability

- Support for fuzzy search, which means the search keyword may have misspellings or incorrect syntax, elasticsearch still has the ability to return good results.

- Support Structured Query DSL (Domain-Specific Language), which provides explicit and concrete specification of complex queries using JSON.

- Support multiple Elasticsearch clients like Java, PhP, Javascript, Ruby, .NET, Python


### 2. Cons

- Elasticsearch is designed for search purposes, so for tasks other than search like CRUD, Elasticsearch is inferior to other databases like Mongodb, Mysql,... Therefore, people rarely use Elasticsearch as the main database, but often combine it with another database.

- There is no concept of database transaction in Elasticsearch, so that it will not guarantee data integrity in operations Insert, Update, Delete. That is when we change many records if an error occurs, it will make logic is wrong or leads to data loss. This is also the part that makes elasticsearch should not be the main database.

- Not suitable for systems that frequently update data. It will be very expensive to index the data.

---
# References
- [1] [Elasticsearch Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html)
- [2] [Elasticsearch là gì? Tìm hiểu về Elasticsearch](https://topdev.vn/blog/elasticsearch-la-gi/)
- [3] [Elasticsearch Wikipedia](https://en.wikipedia.org/wiki/Elasticsearch)
- [4] [Những khái niệm cơ bản trong Elasticsearch](https://viblo.asia/p/phan-1-nhung-khai-niem-co-ban-trong-elasticsearch-V3m5WzzglO7)
- [5] [Quick Intro to Full-Text Search with ElasticSearch
](https://www.baeldung.com/elasticsearch-full-text-search-rest-api)
- [6] [Full-text search](https://en.wikipedia.org/wiki/Full-text_search)
