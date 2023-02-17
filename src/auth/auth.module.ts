import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey:
          '-----BEGIN RSA PRIVATE KEY-----\n' +
          'MIIJKQIBAAKCAgEAguYYbnMA82LkDw1JOnoqQNNCHX8I6LL7CDIkLZ5JvePBmten\n' +
          'X5K92uHijaHUySR/rSLe5/S/QBnEPSLSQN7VlGTK7085qQofCVZxnLZ3paME9cuf\n' +
          'IhihgzhsRj9tfk9txq0WfWNAnSXWab/mTFqF6188E3DedlfFTC3Obca6i4iPMbRU\n' +
          'IKrH1FDDedcG3UjWeoB5jKSqlnEaRC204Aew/1h+ye/JfE0brFQmmjzbs0S+PsSl\n' +
          'u0/CaOqWFC6DdWYAHbqxuyBd0kIFinwE2eJY7Lk/1qKGE59Uevn1cfg6npIbFAjS\n' +
          'yVc3legAUoQ9Nb1ginLf0NW2X+89jMVaMMtqdAbnUwcEPbkcTyIkMqOFGfOmMuRT\n' +
          'klBIVwDctje7i69GmQFrrdEa7Q5iteqd5x/574XtxSIDmqJyk1YKJ8r3Wz8r7wHL\n' +
          'TYO4Ygr9RTxbfaaljC6jSnSErzqZlIq2FOVgjJgXML78N0XOiCDSXysBMnoBUEkz\n' +
          '5rqAZAMNDECZP+VJAp25xRkF0nFgeVdKCgrQDztZTFyhaAGgKlro2jFmwr4iWxrZ\n' +
          'kfk2fB2iKxSdXnuIaaBD57LV59sVemC3MVkNWErKb0gqfs5y/GZ9fxopLohTCZar\n' +
          '46F9SvWYAUV4z/PWMBi81UMz97ZSlQVMfnHZzbfc5hs8ZO2WT+OGyo+keWsCAwEA\n' +
          'AQKCAgBkoJhViClJ8VLa017hCnsi/ITOAhOKN9VNdqZjP1T3GniCHZi4mylCc/Xi\n' +
          '5W6b9mgEZFMxw++mSmiWiwdRATz1aAqtr5zm+zXiysZqL8eI2Op+PjumTYMUSjLK\n' +
          'SgZVXKBKZFNurvdEF4teHjzfo5Nh3wNi+pi6Jz0wE+Kmd2h+zcsu7a7isgcOi8vK\n' +
          'BWhsgosG/27xlMDjCC2mDfEHbEI/+fr2KFUfLnPApaxLU8+dX5JU1H2HoogUeYpI\n' +
          'F33NqU0bjaMF9JrLgR+bVz2vdhbgXITb7nLd8NVT+IYcSDRgJHeWjjXkvByqLADb\n' +
          'bndTsbLem/K9Kx2ZYGRTrH9qFWZOie8WrPz09CthcoIP9OCIdJrlH62QxioQOszr\n' +
          '2EsxAhZnTuCpA8fDueCFj9SMefJ1SbX0Y4Sud3F9UxWkdW8BOR4PJYK+XXxAOgZL\n' +
          '/4OAXBFQawPF0s3iF4RPALVhSEfYlGUXRpebhLAmLyXNSryTZI23/0ZPDXRxmVLy\n' +
          'U4/PodF8oGNP5bK8XhGzz6YbY7r11wB/N00zao56n1nOTmG9zKdSaTuK7FKRz1H+\n' +
          'Fa7LFJckO7FAHh3Su9uO1zTuGVzTFFd3IPAIUAmMj1sgyhzM+OZD94C0S10HjgVm\n' +
          'PpDlSzi+xrwWqejCmTkEvbshAQHOJk5OX6gVF2mtl4i6CgavyQKCAQEA8F50vctz\n' +
          'p05rn1pwioIVmXv22vB6avmhyYfypKYd0WJ8kcjcDCq7jM7k2uKsqBKXKA5kT6h/\n' +
          'zpYstJQ3y1GB+P8+5o2eFIYCv5P1AuKN7upPWHSNgXW0stPlOSj+F9cj7BUF37YN\n' +
          'MvrdGrCGHMrjfntM06klinMyqnRsLVzVVNasHsORJU2S/FCCaaZI6vsYJjEIwcg2\n' +
          'PUtvR55ZB5Ju83ZbfCXd8U1bBC/Z+xFlXkRNKSsH7HimbT18lLyDreCiOeQiH5aK\n' +
          'X2UfcIkxklbU7rJMQOGsMxOitKVg3RKfbHuljPckqlJv7fKAlXn3xz5a2gy4jV5x\n' +
          'HJFrLm9zX21ifQKCAQEAi2k79tDEAca0qskN+1rdlh9Ppw+QoNpvnlfYU02kT68q\n' +
          'zfR0sCrHKW+uciuiimer9osimVlADWq1W24/K2+bmM9b00z9oQfk6mWb5/NtKAjQ\n' +
          '8GaojN2DTRi8WMzYDQBU9dyJhIh9X+LaAQPz1MTZE2j3UzizUSdPba5Eq6Sq/JIS\n' +
          'w1soCALZ1SjAbLfDp9iIzxMVjeOXljvwM3Vcn3nekx9oyMz01+PasEuoBuOQv3mC\n' +
          '4mVnfSnlDt+DYoYCuQQ2DW5xF13ot0ztz46A9PwjVWPhu8com95DTG6DDvpkEpiH\n' +
          'GoBB1yziGkHLq0dymYpIiKNxqKSd1BrIlNf/33RoBwKCAQEAr5Ju90sqmSRg3C71\n' +
          'UVafbFLuBxHseUMJ9+jDRZzI3u5vSxVKFeEIyVs+MturfcDGhE2u27iaUk3DLcut\n' +
          'zWcl5riaO1FqDFeunjz2lDrjrYWcm2HXEp7ldFHudwgIQWW2KXVZqwSRM5Gl+x7B\n' +
          'dzqDXRm3DkvYzf5DHdqYQbIzaRq88mOrG3JEUOSFvaHmVS0/gHYEjXculysIh2mU\n' +
          'YkGFpXPocxA9w0nbl31UXV1hi6+cJNv3l7Sw684jt4jTLiiMlniarDQLso5snoi3\n' +
          'msquEgROSn4Mh+ppyEWcMR6vMFBIpmTHdVltxIKDhatnXzOerPLpwuke+d0GSw7B\n' +
          'WQzPCQKCAQBZ6KJtiTH/20DFLClCQ9XIbaUXHuitdHKr8gdnohkn8tZuQQvIWa5c\n' +
          'QNSGeTG4hSfYNt83euHeRUV1E+LVhoMYyBJ2cZ7Y7ZhquuETdGCfgyANCogFYQ6+\n' +
          '+AbwVhu4NtCUR4jA2q3Q2yKxqPTl8ZX1+KoZF+Y9nlaRa+SJtgc4IJTNPMrSb9RA\n' +
          'rql69ADRDMsekTZDbdZjY4CED1qO1y/+PjF73wLBAQgWzpQs7TJ66kjI7ZESnaRG\n' +
          'NUwsjDTRUa/ydZml8kCVhp2QUF1Goh2/gk0gp06/R1arwlHvpPhJLelj4/eSaDXh\n' +
          'rTFG4ys7bn1c8dvpYVEQa72UkMFKQW6dAoIBAQC/YKoqROCxWwX9jFMWpCdO37OR\n' +
          'HaeHZ5b6zgFxfkfd5XIQNwR58ZOz0S9RV4MI+qjssbAXa40K6cVkvuSvjk22zF01\n' +
          'RJwMVQbPhaHF4KFLpxFb3TTv/J0rPe5/VjQ9YyKClnpCtgqbrVH92anecNP8rjG5\n' +
          'N4TdWqUSyW4I2txX96ml5P13e1+bRrbiufTN21SI+5HlS62LUV0VxAQ8dxO7oU/J\n' +
          'ErYSf7bS7qpXPgu8pAsedjmhLm+qyrINSMXl1yY2VRuuZOEEmez7jeL82xH/ityj\n' +
          'dy9YRhZb4Nx60GvNlbkr+B43Xl52KKaVXzFAvRcTN2xHN5yygjBMsjW7sVbN\n' +
          '-----END RSA PRIVATE KEY-----\n',

        signOptions: {
          expiresIn: 3600,
          algorithm: 'RS256',
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
