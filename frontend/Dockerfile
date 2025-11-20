FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY angular.json tsconfig*.json ./
COPY src ./src
RUN npm run build -- --output-path=dist/app

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY start-nginx.sh /start-nginx.sh
COPY --from=builder /usr/src/app/dist/app /usr/share/nginx/html
RUN chmod +x /start-nginx.sh
EXPOSE 80
CMD ["/start-nginx.sh"]
