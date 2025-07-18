import { Request } from 'express';
import { IncomingMessage } from 'node:http';

export function getIp(request: Request | IncomingMessage) {
  const req = request as any;

  let ip: string =
    req.headers['x-forwarded-for'] ||
    req.headers['X-Forwarded-For'] ||
    req.headers['X-Real-IP'] ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.ip ||
    undefined;
  if (ip && ip.split(',').length > 0) ip = ip.split(',')[0];

  return ip;
}
