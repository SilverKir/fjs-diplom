export const cookieExtractor = function (req) {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['id'];
  }
  return token;
};
