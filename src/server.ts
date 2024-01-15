import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
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
 * Add api key verification
 */
app.use((req, res, next) => {
  if (!req.headers.authorization || process.env.API_KEY !== req.headers.authorization) {
    const error = new Error('Invalid key');
    error.name = 'UnauthorizedError';

    throw error;
  }

  next();
});

/**
 * Send SMS
 */
app.post(
  '/sendsms',
  async (req: Request<null, { message: string; details?: unknown }, GrafanaNotificationPayload>, res) => {
    const phoneNumber = req.query.number;

    /**
     * No phone number
     */
    if (!phoneNumber) {
      return res.status(400).send({
        message: 'No number parameter',
      });
    }

    /**
     * Invalid phone number
     */
    if (typeof phoneNumber !== 'string') {
      return res.status(400).send({
        message: 'Invalid number parameter',
      });
    }

    /**
     * Send message
     */
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
      /**
       * Unable to send message
       */
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
  /**
   * Token verification error
   */
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({
      message: 'Access Denied',
    });
  }

  /**
   * Unknown Error
   */
  if (err) {
    console.error('Unknown error', err);
    return res.status(500).send({
      message: 'Server Error',
    });
  }

  /**
   * Call next handler
   */
  next();
});

/**
 * Start Server
 */
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
