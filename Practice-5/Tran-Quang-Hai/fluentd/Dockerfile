FROM fluent/fluentd
USER root



RUN apk add --no-cache --update --virtual .build-deps \
    sudo build-base ruby-dev \
    && gem install fluent-plugin-elasticsearch \
    && gem sources --clear-all \
    && apk del .build-deps \
    && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

COPY fluent.conf fluentd/conf/fluent.conf

COPY fluent.conf fluentd/etc/fluent.conf

EXPOSE 24224