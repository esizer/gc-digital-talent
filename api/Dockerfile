FROM php:7.4.27-cli

# Install pdo_pgsql extension.
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

WORKDIR /usr/src/api

COPY composer.json composer.lock ./
COPY tests/ tests/
# Install zip ext required for composer install from dist.
RUN apt-get update \
    && apt-get install -y libzip-dev \
    && docker-php-ext-install zip
# Copy composer binary from official image.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
RUN composer install --prefer-dist

ENTRYPOINT [ "php", "artisan", "serve", "--host=0.0.0.0", "--port=8002" ]
