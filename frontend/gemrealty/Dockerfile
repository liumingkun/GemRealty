# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Build the app 
# NOTE: VITE_ variables like Google Maps API keys should be provided during the build process
# Use --build-arg or Cloud Build secrets for production deployments
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Configure Nginx to listen on the PORT environment variable provided by Cloud Run
CMD sed -i -e 's/listen       8080;/listen       '${PORT:-8080}';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
