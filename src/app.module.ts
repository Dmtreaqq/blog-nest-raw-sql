import { configDynamicModule } from './config-dynamic-module';
import { DynamicModule, Module } from '@nestjs/common';
import { TestingModule } from './features/testing/testing.module';
import { UserPlatformModule } from './features/user-platform/user-platform.module';
import { CommonModule } from './common/common.module';
import { CommonConfig } from './common/common.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserPlatformConfig } from './features/user-platform/config/user-platform.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (commonConfig: CommonConfig) => {
        console.log('Connecting to DB: ' + commonConfig.dbName);
        return {
          type: 'postgres',
          host: commonConfig.dbHost,
          port: commonConfig.dbPort,
          username: commonConfig.dbUser,
          password: commonConfig.dbPass,
          database: commonConfig.dbName,
          autoLoadEntities: false,
          synchronize: false,
          ssl: commonConfig.isDbSsl,
        };
      },
      inject: [CommonConfig],
    }),
    UserPlatformModule,
    BloggersPlatformModule,
    ThrottlerModule.forRootAsync({
      imports: [UserPlatformModule],
      inject: [UserPlatformConfig],
      useFactory: (userPlatformConfig: UserPlatformConfig) => {
        return [
          {
            ttl: userPlatformConfig.throttleTtl,
            limit: userPlatformConfig.throttleLimit,
          },
        ];
      },
    }),
    CommonModule,
    configDynamicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static async forRoot(commonConfig: CommonConfig): Promise<DynamicModule> {
    const additionalModules: any[] = [];

    if (commonConfig.includeTestingModule) {
      console.log('Testing Module Included');
      additionalModules.push(TestingModule);
    }

    return {
      module: AppModule,
      imports: additionalModules,
    };
  }
}
