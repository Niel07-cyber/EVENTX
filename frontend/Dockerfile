# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# This creates the "dist" folder with your static website
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html folder
# NOTE: If your project uses "build" instead of "dist", change /app/dist to /app/build below
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on Port 80 by default (Azure likes this)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]