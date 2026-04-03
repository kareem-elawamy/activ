FROM node:18-alpine

# Set the working directory directly in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
# We use a wildcard to ensure both files are copied if they exist
COPY package*.json ./

# Install dependencies using npm ci for deterministic builds (if package-lock exists)
# Or npm install if it's just package.json
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
