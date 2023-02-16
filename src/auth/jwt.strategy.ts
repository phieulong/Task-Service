import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) {
    super({
      secretOrKey:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2lipj3v81B/tiL9kZ+7US6MSjKgLyIh21v4Qa3sErlGuT5KHdbqP+x8vqWDJK31O1jBQpBfEinT+RjT31se1UgueDwp51ufdC5rhVHl6A6/NlPwjy0JqbuRik/hiPrtArASMdXoCTb34JhwzOS9RMmNRHAKATNiZQw7DRqnWCe1K2J+yM2xAFplbvcophFY4i5CzF+pvCkYsZcKHcLjy5vYvEka/3ocvBl2RX6JDBhWAP+TpZxWfV2hoEGxersGYJLlCXygeWHfiHd6QPAeoGu6/mj1KVKrQUTqkRivtn8kjnHqX03SV0CvI7HslOe2ZozNDoWxuyq2X1Z0/FEDEgQIDAQAB',
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
