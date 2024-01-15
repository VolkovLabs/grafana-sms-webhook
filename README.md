# SMS Alert Channel Notifications for Grafana

## Getting Started

1. Create `.env` file based on `.env.example`
2. Install Docker

## Run

Run the command `npm run start` to start the server.

## Docker Compose

```
version: '3.5'

services:
  sms:
    image: ghcr.io/volkovlabs/grafana-sms-webhook:latest
    container_name: sms
    env_file: .env
    ports:
      - 8080:3000
```

## REST API

```
fetch('http://localhost:3000/sendsms?number=1234567890', {
    method: 'POST',
    headers: {
        authorization: '[apiKey]'
    },
    body: JSON.stringify({
        message: 'Your message'
    })
})
```
