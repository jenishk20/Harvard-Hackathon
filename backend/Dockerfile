# Use official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose the port your backend will use (e.g., 5000)
EXPOSE 5000

# Run the backend (replace with your entry point)
CMD ["node", "app.js"]
