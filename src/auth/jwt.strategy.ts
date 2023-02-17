import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { User } from './users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey:
        '-----BEGIN PUBLIC KEY-----\n' +
        'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAguYYbnMA82LkDw1JOnoq\n' +
        'QNNCHX8I6LL7CDIkLZ5JvePBmtenX5K92uHijaHUySR/rSLe5/S/QBnEPSLSQN7V\n' +
        'lGTK7085qQofCVZxnLZ3paME9cufIhihgzhsRj9tfk9txq0WfWNAnSXWab/mTFqF\n' +
        '6188E3DedlfFTC3Obca6i4iPMbRUIKrH1FDDedcG3UjWeoB5jKSqlnEaRC204Aew\n' +
        '/1h+ye/JfE0brFQmmjzbs0S+PsSlu0/CaOqWFC6DdWYAHbqxuyBd0kIFinwE2eJY\n' +
        '7Lk/1qKGE59Uevn1cfg6npIbFAjSyVc3legAUoQ9Nb1ginLf0NW2X+89jMVaMMtq\n' +
        'dAbnUwcEPbkcTyIkMqOFGfOmMuRTklBIVwDctje7i69GmQFrrdEa7Q5iteqd5x/5\n' +
        '74XtxSIDmqJyk1YKJ8r3Wz8r7wHLTYO4Ygr9RTxbfaaljC6jSnSErzqZlIq2FOVg\n' +
        'jJgXML78N0XOiCDSXysBMnoBUEkz5rqAZAMNDECZP+VJAp25xRkF0nFgeVdKCgrQ\n' +
        'DztZTFyhaAGgKlro2jFmwr4iWxrZkfk2fB2iKxSdXnuIaaBD57LV59sVemC3MVkN\n' +
        'WErKb0gqfs5y/GZ9fxopLohTCZar46F9SvWYAUV4z/PWMBi81UMz97ZSlQVMfnHZ\n' +
        'zbfc5hs8ZO2WT+OGyo+keWsCAwEAAQ==\n' +
        '-----END PUBLIC KEY-----',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) {
      throw new HttpException(
        {
          meta: {
            code: 40008001,
            message: `User not exists.`,
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
