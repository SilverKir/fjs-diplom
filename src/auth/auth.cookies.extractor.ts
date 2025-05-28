import { Request } from 'express';

export const cookieExtractor = function (req: Request) {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['id'] as string;
  }
  return token;
};
