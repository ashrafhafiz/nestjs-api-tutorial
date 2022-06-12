import { Controller, Get, Post, Version } from '@nestjs/common';
import { version } from 'os';
import { AuthService } from './auth.service';

// @Controller({ path: '/auth', version: '1' })
@Controller({ path: '/auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('/login')
  login() {
    return this.authService.login();
  }

  @Version('1')
  @Post('/signup')
  signup() {
    return this.authService.signup();
  }

  @Version('2')
  @Post('/signup')
  signup2() {
    return this.authService.signup();
  }
}
