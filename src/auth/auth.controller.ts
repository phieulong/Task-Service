import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
