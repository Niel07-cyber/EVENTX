FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 3001 (We will tell Terraform this later)
EXPOSE 3001

# Start the server
# Ensure your file is actually at src/server.js
CMD ["npm", "start"]