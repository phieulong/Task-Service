import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: {
        key: 'MIIEpAIBAAKCAQEAxjNvuEx2crcO71BBt1TpVX8O+fz62FahxL9jxdb1qsxGR50K8C2EvFbdqEJEYewDSSEiZhiPNviEvmCq5n3t+0RikadYKEv56jTjPSg9Zqe3W9x5z9c6Bm71wWz4XiseUuhXuOU0fV+rRqSxsjMd4Zx5uS1DGOVdIIKx5ybURR3nbbOK0yyH4qg8hhYYNWZpMSp4+LvDF8b+iIDWzx5wnNYySd5UNRdKxj8/AtSglY6KSkvg6+zEEF3KFQEvXbWmzlGW4Z2elVjahqt7VRpjy2mmXo7THM5NvwJRGWWzPwUSh3loyheXbZWjG+6IiHRRFBrN2w83vZUH1OoBBRcRNwIDAQABAoIBABbCtWOutDN8PiTRTJqnD5yX2LpwiMXrPOyBJg4EH3Ybuz5iFG18bK/MMewun/e2yLHPMkoTK+8eHvBV3YpWj8u5ELC1TPRjtTFmHWpagqKVRAMykHKDvtAaUfKCdwspXHQc5mX/PEXhhKO6KgXSxO2xsHDJd9kWDdm76H4pAVtmXflpOkZpHNRqeBQQuPuV+pwOJAeuw0Zr4Hsi4yBS1hDDhZlP4JpKGtb3NlSjsUU1gXAd88UrH+6CE2mucImOpYFwBm4rF3KOshzp4MKauLrtpwSLb32uyGuvIEBF6QXP/6EMpcp4RjLulvpigYcbO+9NWlVcz8yKY9yzRmVPlgECgYEA5+lRS6+BEaNCnbSb/BdsnfyLzNVKIJ/84X369lLjBFGF6yVx+nGRiaKB7WbwaZukHGOWkkZ+RgWuDlmFmeFxshEQL8KDzaXVs5c0aygirXKbOWrmyCyoTnlPBIjFWEDZYYNvIHnj0mdLl57LLrTI9kVcHHKOCw6PnqwQ/hOOUrcCgYEA2sm7/W8Rmh2tcbIWaLWVcRBEDW204nHU5k9S2EfIGPhUe8UP1OTVYVDXmkVa/+icCSkPHJr+EWi0bh4QfveiExQCwDw7+w8Bdmig2F+8euZdkHUJHxruNVdEjA7i2HN9Nh3Qfuduusdm5JwtfY5jV7pcIPRWRo6zN0GBFBE8tYECgYEA1YHIhpWdjk9wFSEiOoSWSx0m1/3FsSOZ/T+uvPiyaFdlo4dl19yW0M/8LkSHMbNI85n8Fc8wkebIyA1DItibhASRkmbSUZJLnHuolr7sriLFJad1sPTsPtMQHGyOwyFxAIWw2YVeaWcQARcAmI94NMLGeqo8e5F8R+jB/Cik7yECgYEAzoJp6d4DbEek5dMlqbHzm6OxyEcL3E17meO3m6OtcDw9ahHoTper/M4Uo23hZfmGBnN16xc0xvPgkqvYAC/3EDDsI8z3BJL2W3CImZNL0WlNWUPO10hRHZIAhn6qiYoA3qqnmJEUCEKckR4FJiTXCgBCY2ydXr3k1TwD/RAEEIECgYA/S/yjas2IFKxb+j3TdP8RxlUebvopB0Oa+D0BcFOoYx6CVFUFcgq4BZp/zboocpBOPOA18WBq5q1mwOtDwX9S1Iwp0shxPbfljZ+/16U95wzes/X3k6c4m8MdhvjasuFfrsVUemIrDe+PdhK1ikN1N/rLcU1+8CW7zf7SjNEGcg==',
        passphrase: '',
        type: 'private',
      },
      signOptions: {
        expiresIn: 3600,
        algorithm: 'RS256',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
