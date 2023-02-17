import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dtos/auth-credentials.dto';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: AuthCredentialDto): Promise<string> {
    const isExisted = await this.userRepository.findOneBy({
      username: dto.username,
    });
    if (isExisted) {
      throw new HttpException(
        {
          meta: {
            code: 40008001,
            message: `User with username[${dto.username}] already exists.`,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.decryptPassword(dto.password);
    let user = this.userRepository.create({
      username: dto.username,
      password: hashedPassword,
    });

    user = await this.userRepository.save(user);
    if (!user) {
      console.log(`Cannot create user with username[${dto.username}]`);
      return 'failed';
    }
    return 'successed';
  }

  private async decryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async signIn(dto: AuthCredentialDto): Promise<{ access_token: string }> {
    const { username } = dto;
    const user = await this.userRepository.findOneBy({
      username: dto.username,
    });
    if (user && (await bcrypt.compare(dto.password, user.password))) {
      const payload: JwtPayload = { username };

      const access_token: string = this.jwtService.sign(payload);
      return { access_token };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }
}
