import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import twilio from 'twilio';

import { GrafanaNotificationPayload } from './types';

/**
 * Set env variables from .env file
 */
dotenv.config();

/**
 * Create app
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * Create twilio client
 */
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Add JSON Body parser
 */
app.use(bodyParser.json());

/**
 * Send SMS
 */
app.post(
  '/sendsms',
  expressjwt({
    secret: process.env.SECRET || '',
    algorithms: ['HS256'],
    getToken: (req: Request) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      return;
    },
  }),
  async (req: Request<null, { message: string; details: unknown }, GrafanaNotificationPayload>, res) => {
    const phoneNumber = req.query.number;

    if (!phoneNumber) {
      return res.status(400).send({
        message: 'No number parameter',
      });
    }

    if (typeof phoneNumber !== 'string') {
      return res.status(400).send({
        message: 'Invalid number parameter',
      });
    }

    try {
      await twilioClient.messages.create({
        body: req.body.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+${phoneNumber}`,
      });
      res.send({
        message: 'success',
      });
    } catch (e) {
      res.status(502).send({
        message: 'Unable to send message',
        details: e,
      });
    }
  }
);

/**
 * Error Handling
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({
      message: 'Access Denied',
    });
  }

  next();
});

/**
 * Start Server
 */
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
