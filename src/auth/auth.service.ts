import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return 'I am loging in';
  }

  signup() {
    return 'I am signing up';
  }
}
