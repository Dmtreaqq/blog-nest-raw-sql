import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDeviceSession } from '../domain/user-device-session.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateDeviceSessionDto } from '../dto/create-device-session.dto';

@Injectable()
export class UserDeviceSessionsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createSession(dto: CreateDeviceSessionDto) {
    const query = `
    INSERT INTO users_device_sessions (user_id, device_id, ip, device_name, issued_at, expiration_date) 
    VALUES ('${dto.userId}', '${dto.deviceId}', '${dto.ip}', '${dto.deviceName}', ${dto.issuedAt}, ${dto.expirationDate});
    `;

    await this.dataSource.query(query);
  }
  // async findOne(id: string): Promise<UserDeviceSessionDocument> {
  //   return this.UserDeviceSessionModel.findById(id);
  // }
  // async findByDeviceId(deviceId: string): Promise<UserDeviceSessionDocument> {
  //   return this.UserDeviceSessionModel.findOne({
  //     deviceId,
  //   });
  // }
  // async isDeviceSessionActive(deviceId: string, issuedAt: number) {
  //   const session = await this.UserDeviceSessionModel.findOne({
  //     deviceId,
  //     issuedAt,
  //   });
  //   return session;
  // }

  async findByDeviceIdAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<UserDeviceSession | null> {
    const query = `
      SELECT id, issued_at as "issuedAt", expiration_date as "expirationDate"
      FROM users_device_sessions
      WHERE device_id = $1 AND user_id = $2;
    `;

    const result = await this.dataSource.query(query, [deviceId, userId]);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async updateDeviceSession(
    sessionId: string,
    newIssuedAt: number,
    newExpDate: number,
  ) {
    const query = `
        UPDATE users_device_sessions
        SET issued_at = ${newIssuedAt}, expiration_date = ${newExpDate}
        WHERE id = '${sessionId}';
    `;

    await this.dataSource.query(query);
  }

  // async deleteManyExcept(deviceId: string, userId: string) {
  //   await this.UserDeviceSessionModel.deleteMany({
  //     userId: userId,
  //     deviceId: { $ne: deviceId },
  //   });
  // }

  async deleteSession(id: string) {
    const query = `
        DELETE FROM users_device_sessions
        WHERE id = '${id}';
    `;

    await this.dataSource.query(query);
  }
}
