import { Injectable } from '@nestjs/common';

import { UserDeviceSession } from '../../domain/user-device-session.entity';
import { UserDeviceSessionsViewDto } from '../../api/view-dto/user-device-sessions.view-dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UserDeviceSessionsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAll(userId: string): Promise<UserDeviceSessionsViewDto[]> {
    const query = `
      SELECT ip, device_name as "deviceName", device_id as "deviceId", issued_at as "issuedAt" 
      FROM users_device_sessions
      WHERE user_id = '${userId}';
    `;

    const result: UserDeviceSession[] = await this.dataSource.query(query);
    if (result.length === 0) return [];

    const items = result.map(UserDeviceSessionsViewDto.mapToView);

    return items;
  }
}
