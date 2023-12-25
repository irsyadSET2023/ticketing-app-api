import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './request';
import { parseMessage } from 'src/helper';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() authRequest: AuthRequest) {
    const registerData = await this.authService.register(authRequest);
    return parseMessage(registerData, 'Log In');
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authRequest: AuthRequest) {
    const loginData = await this.authService.login(authRequest);
    return parseMessage(loginData, 'Log In');
  }
}
