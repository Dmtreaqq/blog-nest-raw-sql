import { CreateDeviceSessionDto } from '../dto/create-device-session.dto';

export class UserDeviceSession {
  userId: string;

  deviceId: string;

  ip: string;

  deviceName: string;

  issuedAt: number;

  expirationDate: number;
}
