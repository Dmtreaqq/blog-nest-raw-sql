import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDeviceSession } from '../domain/user-device-session.entity';

@Injectable()
export class UserDeviceSessionsRepository {
  // constructor(
  //   @InjectModel(UserDeviceSession.name)
  //   private UserDeviceSessionModel: UserDeviceSessionModelType,
  // ) {}
  // async save(deviceSession: UserDeviceSessionDocument) {
  //   await deviceSession.save();
  // }
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
