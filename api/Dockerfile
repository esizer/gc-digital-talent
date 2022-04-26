FROM php:7.4.27-cli

# Install pdo_pgsql extension.
# Install zip ext required for composer install from dist.
RUN apt-get update \
    && apt-get install -y libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql \
    && docker-php-ext-install zip

# Copy composer binary from official image.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /usr/src/api

#required files for composer build
COPY composer.json composer.lock ./

# no scripts - files aren't mounted in yet to run
RUN composer install --no-scripts
