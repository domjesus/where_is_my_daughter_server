FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    oniguruma-dev \
    sqlite-dev

RUN docker-php-ext-install pdo_sqlite mbstring zip exif pcntl gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
# Remove .env so composer post-install hooks don't try to parse it
RUN rm -f .env

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN touch /var/www/html/database/database.sqlite && \
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

USER www-data

EXPOSE 9000
CMD ["php-fpm"]
