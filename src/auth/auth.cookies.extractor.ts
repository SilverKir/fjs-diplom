import { Request } from 'express';

export const cookieExtractor = function (req: Request) {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['id'] as string;
  }
  return token;
};

export const extractTokenFromHeader = (request: Request): string | null => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : null;
};

export const tokenExtractor = (request: Request): string | null => {
  const first = cookieExtractor(request);
  const second = extractTokenFromHeader(request);

  if (first && second) {
    return second.concat(first);
  }
  return first ? first : second;
};
