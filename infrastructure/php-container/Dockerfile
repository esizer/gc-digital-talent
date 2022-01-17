FROM php:7.4-apache

# Enable mod_rewrite
RUN a2enmod rewrite

# Install pdo_pgsql extension
RUN apt-get update \
    && apt-get install -y curl tar wget sudo \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && apt-get clean

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md
RUN wget https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer -O - -q | php -- --quiet \
  && mv composer.phar /usr/bin/composer

# https://github.com/nodejs/help/wiki/Installation
ENV NODE_VERSION=v14.18.1
ENV NODE_DISTRO=linux-x64
ENV PATH="/usr/local/lib/nodejs/node-$NODE_VERSION-$NODE_DISTRO/bin:${PATH}"
RUN set -ex \
  && mkdir -p /usr/local/lib/nodejs \
  && curl -o node-$NODE_VERSION-$NODE_DISTRO.tar.xz https://nodejs.org/download/release/$NODE_VERSION/node-$NODE_VERSION-$NODE_DISTRO.tar.xz \
  && tar -xJvf node-$NODE_VERSION-$NODE_DISTRO.tar.xz -C /usr/local/lib/nodejs

RUN npm install -g npm@latest \
  && npm cache clean --force

ENV WORKSPACE=/workspace
RUN mkdir $WORKSPACE
#RUN useradd -ms /bin/bash dockeruser \
#  && echo 'dockeruser     ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
#USER dockeruser


