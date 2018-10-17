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

COPY ./test.php /usr/local/apache2/cgi-bin/test.php

RUN chmod +x /usr/local/apache2/cgi-bin/test.php
RUN sed -i 's/#LoadModule cgid_module/LoadModule cgid_module/g' /usr/local/apache2/conf/httpd.conf

EXPOSE 80
