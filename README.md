# SMS Alert Channel

## Getting Started

1. Create `.env` file based on `.env.example`
2. Install Docker

## Run

Run the command `npm run start` to start server

## Using

```
fetch('http://localhost:3000/sendsms?phoneNumber=123', {
    method: 'POST',
    headers: {
        authorization: '[apiKey]'
    },
    body: JSON.stringify({
        message: 'Your message'
    })
})
```
