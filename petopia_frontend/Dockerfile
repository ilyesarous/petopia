# Stage 1: Build the Angular application
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/petopia-frontend /usr/share/nginx/html

# Optional: Overwrite default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
