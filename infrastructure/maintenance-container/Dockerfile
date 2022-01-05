FROM ubuntu:20.04

# install apt packages
# installing tzdata has an interactive prompt by default
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
  && apt-get install -y perl unzip wget curl git gnupg sudo \
  && apt-get install -y php7.4 php-mbstring php-xml php-pgsql php-zip

# so many issues installing specific version from nvm or nodesource so decided to just do it from binary
# https://github.com/nodejs/help/wiki/Installation
ENV NODE_VERSION=v14.18.1
ENV NODE_DISTRO=linux-x64
ENV PATH="/usr/local/lib/nodejs/node-$NODE_VERSION-$NODE_DISTRO/bin:${PATH}"
RUN set -ex \
  && mkdir -p /usr/local/lib/nodejs \
  && curl -o node-$NODE_VERSION-$NODE_DISTRO.tar.xz https://nodejs.org/download/release/$NODE_VERSION/node-$NODE_VERSION-$NODE_DISTRO.tar.xz \
  && tar -xJvf node-$NODE_VERSION-$NODE_DISTRO.tar.xz -C /usr/local/lib/nodejs

RUN npm install -g npm@latest

# install composer from github, only v1 available from apt and we need v2
# https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md
RUN wget https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer -O - -q | php -- --quiet \
  && mv composer.phar /usr/bin/composer

# Setup non-root user.  Node doesn't like to run as root. Make a sudoer.
RUN useradd -ms /bin/bash -g www-data dockeruser \
  && echo 'dockeruser     ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER dockeruser
