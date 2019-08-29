FROM node:latest
COPY front /var/www/front
WORKDIR /var/www/front
RUN npm install

FROM nginx

COPY back /var/www/symfony
COPY --from=0 /var/www/front /var/www/front
COPY symfony.conf /etc/nginx/conf.d/default.conf
