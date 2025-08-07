# Use an official Node.js runtime as a parent image
FROM node:20-alpine

WORKDIR /home/node/app

COPY /client/package*.json /client/tsconfig.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY /client/ .

RUN npm run build

# Expose the port your application listens on
EXPOSE 3000

# Define the command to run your application
CMD [ "npm", "start" ]
