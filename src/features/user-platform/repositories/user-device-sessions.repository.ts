import { BadRequestException, Injectable } from '@nestjs/common';
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
  // async findByDeviceIdAndUserId(
  //   deviceId: string,
  //   userId: string,
  // ): Promise<UserDeviceSessionDocument> {
  //   return this.UserDeviceSessionModel.findOne({
  //     deviceId,
  //     userId,
  //   });
  // }
  // async deleteManyExcept(deviceId: string, userId: string) {
  //   await this.UserDeviceSessionModel.deleteMany({
  //     userId: userId,
  //     deviceId: { $ne: deviceId },
  //   });
  // }
  // async delete(session: UserDeviceSessionDocument) {
  //   const result = await session.deleteOne();
  //   if (result.deletedCount !== 1) {
  //     throw new BadRequestException([
  //       {
  //         message: 'Entity was not deleted for some reason',
  //         field: 'id',
  //       },
  //     ]);
  //   }
  // }
}
