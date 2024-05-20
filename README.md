# SMS Alert Channel Notifications for Grafana

## Requirements

- Docker, Docker Compose or Node v18 for host installation.
- Twilio account.

## Getting Started

1. Create `.env` file based on `.env.example`.
2. Start a container or run as a standalone.
3. Create a Contact Point in Grafana Alerting.

![Contact Point](https://github.com/VolkovLabs/grafana-sms-webhook/raw/main/img/contact.png)

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

## Run as standalone

Run the command `npm install` and `npm run start` to start the server.

## REST API

```
fetch('http://localhost:3000/sendsms?number=1234567890,12223334455', {
    method: 'POST',
    headers: {
        authorization: '[apiKey]'
    },
    body: JSON.stringify({
        message: 'Your message'
    })
}).then((response) => response.text())
  .then((body) => {
    console.log(body);
  })
  .catch((error) => {
    console.error('error in execution', error);
  })
```

## Logging
`LOG_LEVEL` config is set in `.env` file. All possible values are described in [Winston Logging Levels](https://github.com/winstonjs/winston?tab=readme-ov-file#logging-levels)

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/grafana-sms-webhook/issues/new/choose).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and add a comment.
- Sponsor our open-source plugins for Grafana at [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Support our project by starring the repository.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/grafana-sms-webhook/blob/main/LICENSE).
