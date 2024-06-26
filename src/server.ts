import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import twilio from 'twilio';
import winston from 'winston';

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
 * Create logger
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  transports: [new winston.transports.Console()],
});

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
     * Log payload
     */
    logger.info('Request query:', req.query);
    logger.info('Request body:', req.body);

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
     * Split to multiple numbers
     */
    const numbers = phoneNumber.split(',');

    /**
     * Prepare messages
     */
    const allPromise = Promise.all(
      numbers.map(async (number) => {
        const params = {
          body: req.body.message || 'Test',
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+${number}`,
        };

        /**
         * Log twilio payload
         */
        logger.info('Request to Twilio:', params);

        /**
         * Create message
         */
        const result = await twilioClient.messages.create(params);

        /**
         * Log twilio response
         */
        logger.info('Twilio Response:', result);
      })
    );

    /**
     * Send message
     */
    try {
      await allPromise;

      res.send({
        message: 'success',
      });
    } catch (e) {
      /**
       * Log error message
       */
      logger.error('Twilio Error:', e);

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
    logger.error('Unknown error', err);
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
  logger.info(`App listening on port ${port}`);
});
