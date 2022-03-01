FROM node:14.18.1-bullseye as base

ENV NPM_VERSION="8.3.0"

RUN npm install --global npm@$NPM_VERSION

WORKDIR /var/www/html/frontend

COPY package.json package-lock.json ./

# Install npm dependencies for all workspaces
RUN npm install $(test "$APP_ENV" == production && echo "--production") \
    && npm rebuild node-sass

# Install composer dependencies for all Laravel projects
FROM base as builder

# Install zip ext required for composer install from dist.
RUN apt-get update \
    && apt-get install -y libzip-dev \
    && docker-php-ext-install zip
# Copy composer binary from official image.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html/frontend/admin
RUN composer install --prefer-dist

WORKDIR /var/www/html/frontend/talentsearch
RUN composer install --prefer-dist

# Re-use base layer without composer
FROM base
COPY --from=builder /var/www/html/admin/vendor admin/vendor
COPY --from=builder /var/www/html/talentserach/vendor talentsearch/vendor

# Default configurations in case needed.
COPY admin/.env.example admin/.env
COPY talentsearch/.env.example talentsearch/.env
# Overrides default with custom .env if file exists.
COPY . .

# Run setup npm scripts in each workspace
WORKDIR /var/www/html/frontend/common

RUN npm run h2-build
RUN npm run codegen
RUN npm run intl-compile

WORKDIR /var/www/html/frontend/talentsearch
RUN npm run h2-build
RUN npm run codegen
RUN npm run intl-compile

WORKDIR /var/www/html/talentsearch
RUN npm run h2-build
RUN npm run codegen
RUN npm run intl-compile
RUN npm run dev

WORKDIR /var/www/html/frontend/admin
RUN npm run h2-build
RUN npm run codegen
RUN npm run intl-compile
RUN npm run

# Use php layer to run laravel projects
FROM php:7.4.27-apache-bullseye as php-layer
COPY --from=base /var/www/html

WORKDIR /var/www/html/frontend /var/www/html/frontend

RUN chmod -R 777 .admin/storage \
    && chmod -R 777 .talentsearch/storage
