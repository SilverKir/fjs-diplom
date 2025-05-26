Подключили
{ user: any },
@Res({ passthrough: true }) response: Response,
): any {
response.cookie('id', req.user);
return req.user;
