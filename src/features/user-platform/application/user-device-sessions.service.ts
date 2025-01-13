import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDeviceSessionsRepository } from '../repositories/user-device-sessions.repository';
import { CreateDeviceSessionDto } from '../dto/create-device-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDeviceSession } from '../domain/user-device-session.entity';

@Injectable()
export class UserDeviceSessionsService {
  constructor(
    // @InjectModel(UserDeviceSession.name)
    // private UserDeviceSessionModel: UserDeviceSessionModelType,
    private userDeviceSessionsRepository: UserDeviceSessionsRepository,
  ) {}

  async createDeviceSession(dto: CreateDeviceSessionDto) {
    await this.userDeviceSessionsRepository.createSession(dto);
  }

  async updateDeviceSession(
    deviceId: string,
    userId: string,
    newIat: number,
    newExp: number,
    oldIat: number,
  ) {
    const session =
      await this.userDeviceSessionsRepository.findByDeviceIdAndUserId(
        deviceId,
        userId,
      );

    if (!session) {
      throw new UnauthorizedException(
        `There is no session with deviceId: ${deviceId} and userId: ${userId}`,
      );
    }

    if (session.issuedAt !== oldIat) {
      // TODO: we can delete session I believe
      throw new UnauthorizedException('Session already invalid');
    }

    await this.userDeviceSessionsRepository.updateDeviceSession(
      session.id,
      newIat,
      newExp,
    );
  }

  async deleteCurrentDeviceSession(
    deviceId: string,
    userId: string,
    iat: number,
  ) {
    // const session =
    //   await this.userDeviceSessionsRepository.findByDeviceIdAndUserId(
    //     deviceId,
    //     userId,
    //   );

    // if (!session) {
    //   throw new UnauthorizedException(
    //     `There is no session with deviceId: ${deviceId} and userId: ${userId}`,
    //   );
    // }

    // if (session.issuedAt !== iat) {
    //   throw new UnauthorizedException('It is already invalid session');
    // }

    // await this.userDeviceSessionsRepository.delete(session);
    console.log('delete current session device');
  }

  async deleteAllDeviceSessionExceptCurrent(deviceId: string, userId: string) {
    console.log('deleet all sessions');
    // await this.userDeviceSessionsRepository.deleteManyExcept(deviceId, userId);
  }

  async deleteSpecificDeviceSession(deviceId: string, userId: string) {
    console.log('session deleted');
    // const session =
    //   await this.userDeviceSessionsRepository.findByDeviceId(deviceId);

    // if (!session) {
    //   throw new NotFoundException(
    //     `There is no session with deviceId: ${deviceId}`,
    //   );
    // }

    // if (session.userId !== userId) {
    //   throw new ForbiddenException();
    // }

    // await this.userDeviceSessionsRepository.delete(session);
  }
}
