# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 3000

# Set the environment variable NODE_ENV to "production"
ENV NODE_ENV=production

# Set the environment variable KAFKA_CONNECT_CLUSTERS
ENV KAFKA_CONNECT_CLUSTERS=http://localhost:8085/

# Build the React application
RUN npm run build

# Install a lightweight web server
# RUN npm install -g serve

# Set the command to start the web server and serve the built application
CMD ["node", "serve"]

# CMD ["npm", "run", "start:dev"]
