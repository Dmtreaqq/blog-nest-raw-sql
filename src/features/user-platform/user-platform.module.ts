import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { User } from './domain/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/query/users.query-repository';
import { CryptoService } from './application/crypto.service';
import { AuthService } from './application/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './api/guards/local.strategy';
import { AuthController } from './api/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CommunicationModule } from '../communication/communication.module';
import { UserPlatformConfig } from './config/user-platform.config';
import { UserDeviceSession } from './domain/user-device-session.entity';
import { UserDeviceSessionsService } from './application/user-device-sessions.service';
import { UserDeviceSessionsRepository } from './repositories/user-device-sessions.repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { UserDeviceSessionsQueryRepository } from './repositories/query/user-device-sessions.query-repository';

// TODO: спросить почему мьі добавили паспорт модуль
@Module({
  imports: [
    CommunicationModule,
    PassportModule,
    JwtModule.register({}),
    // JwtModule.registerAsync({
    //   useFactory: (
    //     commonConfig: CommonConfig,
    //     userPlatformConfig: UserPlatformConfig,
    //   ) => {
    //     return {
    //       secret: commonConfig.accessTokenSecret,
    //       signOptions: {
    //         expiresIn: `${userPlatformConfig.accessTokenExpiration}m`,
    //       },
    //     };
    //   },
    //   inject: [CommonConfig, UserPlatformConfig],
    //   extraProviders: [UserPlatformConfig],
    // }),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    CryptoService,
    AuthService,
    LocalStrategy,
    UserPlatformConfig,
    UserDeviceSessionsService,
    UserDeviceSessionsRepository,
    UserDeviceSessionsQueryRepository,
  ],
  exports: [UsersRepository, UserDeviceSessionsService, UserPlatformConfig],
})
export class UserPlatformModule {}
