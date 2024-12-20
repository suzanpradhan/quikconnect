import crypto from 'crypto';

export class TokenService {
  static generate() {
    const token = crypto.randomBytes(32).toString('hex');
    return {
      token,
      hash: crypto.createHash('sha256').update(token).digest('hex'),
      expiry: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  static validate(token: string, hashedToken: string) {
    return crypto.createHash('sha256').update(token).digest('hex') === hashedToken;
  }
}


