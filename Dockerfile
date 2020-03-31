FROM node:12.4.0-alpine
MAINTAINER vladov3000@gmail.com

# Set workdir
WORKDIR /game1

# add /game1/node_modules/.bin to $PATH
ENV PATH /game1/node_modules/.bin:$PATH

# install dependencies
RUN npm install --silent

# game works on port 5000 inside container
EXPOSE 5000

# code runs when container starts
ENTRYPOINT["npm", "run", "start"]