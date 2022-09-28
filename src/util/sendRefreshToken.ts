import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  return res.cookie('hitman', token, {
    httpOnly: true,
    path: '/refresh', //that route is to generate a new access token if the old one has expired
  });
};
