# Build PHP container which will execute backend.
FROM php:7.3-fpm

RUN apt-get update && apt-get install -y \
    openssl \
    git \
    unzip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
&& composer --version

RUN docker-php-ext-install pdo pdo_mysql

#Copy sources files
COPY back /var/www/symfony

WORKDIR /var/www/symfony

RUN composer install