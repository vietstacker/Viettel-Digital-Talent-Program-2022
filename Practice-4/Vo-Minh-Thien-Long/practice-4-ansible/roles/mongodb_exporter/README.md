# Ansible Role for Percona MongoDB Exporter

[![Build Status](https://travis-ci.org/kostiantyn-nemchenko/ansible-role-mongodb-exporter.svg?branch=master)](https://travis-ci.org/kostiantyn-nemchenko/ansible-role-mongodb-exporter)
[![Ansible Galaxy](https://img.shields.io/badge/galaxy-kostiantyn--nemchenko.mongodb__exporter-blue.svg)](https://galaxy.ansible.com/kostiantyn-nemchenko/mongodb_exporter)

An Ansible role which installs and configures Prometheus MongoDB Exporter by Percona.

## Requirements

1) Automatic TLS/SSL certificates generation is out of scope of this role. Make sure you [enabled](https://github.com/kostiantyn-nemchenko/ansible-role-mongodb-exporter/blob/master/defaults/main.yml#L54) TLS connection with MongoDB instance and specified correct values for [CA](https://github.com/kostiantyn-nemchenko/ansible-role-mongodb-exporter/blob/master/defaults/main.yml#L61), [client certificates](https://github.com/kostiantyn-nemchenko/ansible-role-mongodb-exporter/blob/master/defaults/main.yml#L68) and [client key](https://github.com/kostiantyn-nemchenko/ansible-role-mongodb-exporter/blob/master/defaults/main.yml#L75). Example:

    ```yaml
    mongodb_exporter_mongodb_tls_cert:
      dest: /etc/ssl/certs/mongodb_exporter.crt
      owner: root
      group: root
      mode: "0644"
      content: |
        -----BEGIN CERTIFICATE-----
        content
        of the public
        certificate
        -----END CERTIFICATE-----
    ```

2) A database user needs to be present on all monitored MongoDB instances with appropriate buit-in roles assigned. Please, see [example](https://github.com/percona/mongodb_exporter#flags).

3) The role requires root privileges, so set `become: true` in any [convenient way](https://docs.ansible.com/ansible/latest/user_guide/become.html) for you. Please, see [example playbook](https://github.com/kostiantyn-nemchenko/ansible-role-mongodb-exporter#example-playbook).


## Role Variables
```yaml
# Exporter version to install
mongodb_exporter_version: 0.7.0
# Exporter repository URL
mongodb_exporter_base_url: https://github.com/percona/mongodb_exporter
# Exporter download URL
mongodb_exporter_release_url: "{{ mongodb_exporter_base_url }}/releases/download/v{{ mongodb_exporter_version }}/mongodb_exporter-{{ mongodb_exporter_version }}.{{ ansible_system |lower }}-amd64.tar.gz"

# OS user to run exporter under
mongodb_exporter_system_user: mongodb_exporter
# OS groups to include user into
mongodb_exporter_system_groups: ['mongodb_exporter', 'ssl-cert']
# Additional packages to setup as role/exporter dependencies
mongodb_exporter_system_packages:
  - { name: ca-certificates, state: present }
  - { name: tar,             state: present }

# List of environment variables to set before starting exporter
mongodb_exporter_env_vars: []

# Path to file that contains preset environment variables
mongodb_exporter_env_file:
  dest: /etc/systemd/system/mongodb_exporter.service.d/environment.conf
  owner: root
  group: root
  mode: "0640"
# Path to directory that contains exporter binary
mongodb_exporter_bin_dir:
  dest: /usr/local/bin
  owner: root
  group: root
  mode: "0755"

# Address to listen on for web interface and telemetry
mongodb_exporter_web_listen_address: :9216
# Path under which to expose metrics
mongodb_exporter_web_telemetry_path: /metrics

# Enable collection of database metrics
mongodb_exporter_collect_database: false
# Enable collection of collection metrics
mongodb_exporter_collect_collection: false
# Enable collection of table top metrics
mongodb_exporter_collect_topmetrics: false
# Enable collection of per index usage stats
mongodb_exporter_collect_indexusage: false

# MongoDB URI in format [mongodb://][user:pass@]host1[:port1][,host2[:port2],...][/database][?options]
mongodb_exporter_mongodb_uri: mongodb://127.0.0.1:27017

# Enable tls connection with mongo server
mongodb_exporter_mongodb_tls: false
# Path to PEM file that contains the CAs that are trusted for server connections
mongodb_exporter_mongodb_tls_ca:
  dest: /etc/ssl/certs/mongodb_exporter_CA.pem
  owner: root
  group: root
  mode: "0644"
  content: ""
# Path to PEM file that contains the certificate (and optionally also the decrypted private key in PEM format)
mongodb_exporter_mongodb_tls_cert:
  dest: /etc/ssl/certs/mongodb_exporter.crt
  owner: root
  group: root
  mode: "0644"
  content: ""
# Path to PEM file that contains the decrypted private key (if not contained in mongodb.tls-cert file)
mongodb_exporter_mongodb_tls_private_key:
  dest: /etc/ssl/private/mongodb_exporter.key
  owner: root
  group: ssl-cert
  mode: "0640"
  content: ""
# Disable hostname validation for server connection
mongodb_exporter_mongodb_tls_disable_hostname_validation: false
# Max number of pooled connections to the database
mongodb_exporter_mongodb_max_connections: 1
# Amount of time to wait for a non-responding socket to the database before it is forcefully closed
mongodb_exporter_mongodb_socket_timeout: 3s
# Amount of time an operation with this session will wait before returning an error in case a connection to a usable server can't be established
mongodb_exporter_mongodb_sync_timeout: 1m
# Specifies the database in which the user is created
mongodb_exporter_authentification_database: ""

# Currently ignored
mongodb_exporter_groups_enabled: ""
```

## Dependencies
None

## Example Playbook
```yaml
- hosts: mongodb
  become: yes
  roles:
    - kostiantyn-nemchenko.mongodb_exporter
```

## License
MIT

## Author Information
Kostiantyn Nemchenko kostiantyn.nemchenko@gmail.com
