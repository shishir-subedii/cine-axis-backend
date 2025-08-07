
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { JwtmoduleModule } from './common/jwtmodule/jwtmodule.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MerchantModule } from './merchant/merchant.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: configService.get<number>('RATE_LIMIT_TTL', 60000),
            limit: configService.get<number>('RATE_LIMIT_MAX', 70),
          },
        ],
      }),
    }),
    DatabaseModule, UsersModule, AuthModule, AppConfigModule, JwtmoduleModule, MerchantModule, AdminModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // add throttler guard globally
    },
  ],
})
export class AppModule { }
