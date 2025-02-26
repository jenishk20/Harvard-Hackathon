# Use Node.js image for building the React app
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the static build files
RUN npm install -g serve

# Expose the port for React (default is 3000)
EXPOSE 5173

# Serve the build directory (React app)
CMD ["serve", "-s", "build"]
