import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// @Controller({ path: '/auth', version: '1' })
@Controller({ path: '/auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  // @HttpCode(200)
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signin(@Body() body: AuthDto) {
    console.log(body);
    return this.authService.signin(body);
  }

  @Version('1')
  @Post('/signup')
  signup(@Body() body: AuthDto) {
    console.log(body);
    return this.authService.signup(body);
  }

  // @Version('2')
  // @Post('/signup')
  // signup2() {
  //   return this.authService.signup();
  // }
}
