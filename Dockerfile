FROM node:18 as builder

WORKDIR /app

# Copy files
COPY . .

## Install packages and build
RUN npm install
RUN npm run build

## Alpine Linux
FROM node:alpine

WORKDIR /app/

## Copy
COPY package*.json ./

## Copy Application
COPY --from=builder /app/dist ./dist

## Production install
ENV NODE_ENV=production
RUN npm install

## Start Server
CMD [ "npm", "run", "prod" ]
