FROM httpd:2.4.35

RUN apt-get update \
    && apt-get install -y --force-yes --no-install-recommends \
        ca-certificates \
        vim \
        curl \
        software-properties-common \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN apt-get update \
    && apt-get install -y --force-yes --no-install-recommends \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY ./tmp/src/ /usr/local/apache2/cgi-bin/smjs/src/
COPY ./tmp/package.json /usr/local/apache2/cgi-bin/smjs/package.json
COPY ./tmp/yarn.lock /usr/local/apache2/cgi-bin/smjs/yarn.lock
COPY ./tmp/bin/ /usr/local/apache2/cgi-bin/smjs/bin/
COPY ./tmp/*.js /usr/local/apache2/cgi-bin/smjs/
COPY ./test.php /usr/local/apache2/cgi-bin/test.php

RUN chmod +x /usr/local/apache2/cgi-bin/test.php
RUN sed -i 's/#LoadModule cgid_module/LoadModule cgid_module/g' /usr/local/apache2/conf/httpd.conf

EXPOSE 80
