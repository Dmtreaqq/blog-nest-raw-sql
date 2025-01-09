import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { API_PATH } from '../../../../src/common/constants';
import { API_PREFIX } from '../../../../src/settings/global-prefix.setup';
import { UsersTestManager } from '../../../helpers/users-test-manager';
import { createUserInput } from '../../../helpers/inputs';
import { initSettings } from '../../../helpers/init-settings';
import { UserViewDto } from '../../../../src/features/user-platform/api/view-dto/users.view-dto';
import { delay } from '../../../helpers/delay';
import { UsersRepository } from '../../../../src/features/user-platform/repositories/users.repository';
import { UserDeviceSessionsRepository } from '../../../../src/features/user-platform/repositories/user-device-sessions.repository';
import { JwtService } from '@nestjs/jwt';

describe('Sessions Positive (e2e)', () => {
  let app: INestApplication;
  let refreshToken1: string;
  let refreshToken2: string;
  let user1: UserViewDto;
  let user2: UserViewDto;
  let jwtService: JwtService;

  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;

    usersTestManager = result.usersTestManager;

    user1 = await usersTestManager.createUser({
      ...createUserInput,
      password: 'password',
    });

    user2 = await usersTestManager.createUser({
      email: 'supertotal@gmail.com',
      login: 'supertotal',
      password: 'password',
    });
    const tokens1 = await usersTestManager.loginWithUserAgent(
      user1.email,
      'password',
      'iPhone',
    );
    const tokens2 = await usersTestManager.loginWithUserAgent(
      user2.email,
      'password',
      'Android',
    );

    refreshToken1 = tokens1.refreshToken;
    refreshToken2 = tokens2.refreshToken;

    jwtService = result.app.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(
      API_PREFIX + API_PATH.TEST_DELETE,
    );
    await app.close();
    // await mongoServer.stop();
  });

  it('Should return 404 while delete not existing deviceId session', async () => {
    await request(app.getHttpServer())
      .delete(API_PREFIX + API_PATH.SECURITY + '/devices/12345')
      .set('Cookie', [refreshToken1])
      .expect(HttpStatus.NOT_FOUND);
  });

  it('Should return 403 while delete not yours deviceId session', async () => {
    const token = await jwtService.decode(
      refreshToken2.split(';')[0].slice(13),
    );

    await request(app.getHttpServer())
      .delete(API_PREFIX + API_PATH.SECURITY + `/devices/${token.deviceId}`)
      .set('Cookie', [refreshToken1])
      .expect(HttpStatus.FORBIDDEN);
  });
});
