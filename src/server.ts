import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { expressjwt, Request as JWTRequest } from 'express-jwt';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
  async (req: JWTRequest, res) => {
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

    console.log('request', req.headers);
    console.log('number', phoneNumber);

    res.send({
      message: 'Success',
    });
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({
      message: 'Access Denied',
    });
  }

  next();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
