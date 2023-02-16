import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dtos/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/signup')
  signUp(@Body() dto: AuthCredentialDto): Promise<string> {
    return this.service.signUp(dto);
  }

  @Post('/signin')
  signIn(@Body() dto: AuthCredentialDto): Promise<{ access_token: string }> {
    return this.service.signIn(dto);
  }
}
