import { UserDeviceSession } from '../../domain/user-device-session.entity';

export class UserDeviceSessionsViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  // todo typing
  static mapToView(session: UserDeviceSession): UserDeviceSessionsViewDto {
    const dto = new UserDeviceSessionsViewDto();

    dto.ip = session.ip;
    dto.title = session.deviceName;
    dto.deviceId = session.deviceId;
    dto.lastActiveDate = new Date(session.issuedAt * 1000).toISOString();

    return dto;
  }
}
