import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: any) => {
  return sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: any) => {
  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_REFRESH,
    { expiresIn: '7d' }
  );
};
