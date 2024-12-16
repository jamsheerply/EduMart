# Use an official Node.js image as the base
FROM node:alpine

# Set the working directory inside the container
WORKDIR /server

# Copy only the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port your application will run on
EXPOSE 9000

# Start the application
CMD [ "npm", "start" ]
