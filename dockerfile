# Use official Node.js LTS image
FROM node:22

# Set working directory inside container
WORKDIR /usr/src/app/

# Copy the application code
COPY . .

# BUILD FRONTEND
WORKDIR /usr/src/app/frontend

# Install packages
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/frontend
RUN rm -rf /usr/src/app/frontend

# BUILD BACKEND
WORKDIR /usr/src/app/backend
RUN npm install
RUN npm run build-dist

# Expose port (change if your app uses a different port)
EXPOSE 8080

# Run the application
CMD ["npm", "run", "dist"]

