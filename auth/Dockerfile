FROM php:7.4.27-cli

# Install pdo_pgsql extension.
# Install zip ext required for composer install from dist.
RUN apt-get update \
    && apt-get install -y libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql \
    && docker-php-ext-install zip

# Copy composer binary from official image.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# install node from official image
COPY --from=node:14.18.1 /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node:14.18.1 /usr/local/bin/node /usr/local/bin/
RUN cd /usr/local/bin \
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js npx \
  && ln -s /usr/local/bin/node nodejs

# bump npm version
RUN npm install -g npm@8.7.0

WORKDIR /usr/src/auth

#required files for composer build
COPY composer.json composer.lock ./

# no scripts - files aren't mounted in yet to run
RUN composer install --no-scripts

#required files for node build
COPY package.json package-lock.json ./

RUN npm install

ENTRYPOINT [ "php", "artisan", "serve", "--host=0.0.0.0", "--port=8003" ]
