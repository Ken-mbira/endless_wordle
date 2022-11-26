FROM node:16

# Create app directory
WORKDIR /usr/src/app/backend

# Install dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000

CMD ["npm", "run", "serve"]