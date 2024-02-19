# Dockerfile
# Use node:18-alpine as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the project files
COPY . ./

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
