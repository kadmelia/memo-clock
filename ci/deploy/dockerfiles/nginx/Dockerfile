# Use multistage build to avoid embeding all compilation tooling
# In final container

# Build front in a node container
FROM node:latest AS nodebuilder
COPY front /var/www/front
WORKDIR /var/www/front
RUN npm install && npm run build

# Build back in a php-fpm container
FROM php:7.3-fpm AS phpbuilder
RUN apt-get update && apt-get install -y \
    openssl \
    git \
    unzip \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer --version && docker-php-ext-install pdo pdo_mysql
COPY back /var/www/symfony
WORKDIR /var/www/symfony
RUN composer install && php bin/console assets:install --symlink && php bin/console c:c

# Build an nginx container with both sources.
# php sources are only needed to serve project static assets here.
# There is a better way to achieve this, but eh, it works.
FROM nginx
#Copy sources from previous stages.
COPY --from=phpbuilder /var/www/symfony /var/www/symfony
COPY --from=nodebuilder /var/www/front /var/www/front
# Copy nginx configuration
COPY symfony.conf /etc/nginx/conf.d/default.conf
