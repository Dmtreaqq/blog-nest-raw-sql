import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UserPlatformModule } from '../user-platform/user-platform.module';
import { CommunicationModule } from '../communication/communication.module';
import { CommonModule } from '../../common/common.module';
import { configDynamicModule } from '../../config-dynamic-module';

@Module({
  imports: [
    CommonModule,
    UserPlatformModule,
    CommunicationModule,
    configDynamicModule,
  ],
  controllers: [TestingController],
})
export class TestingModule {}
