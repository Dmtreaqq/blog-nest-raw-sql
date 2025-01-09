import { Injectable } from '@nestjs/common';

import { UserDeviceSession } from '../../domain/user-device-session.entity';
import { UserDeviceSessionsViewDto } from '../../api/view-dto/user-device-sessions.view-dto';

@Injectable()
export class UserDeviceSessionsQueryRepository {
  constructor() {} // private UserDeviceSessionModel: UserDeviceSessionModelType, // @InjectModel(UserDeviceSession.name)

  // async getAll(userId: string): Promise<UserDeviceSessionsViewDto[]> {
  //   const sessions = await this.UserDeviceSessionModel.find({
  //     userId,
  //   });

  //   const items = sessions.map(UserDeviceSessionsViewDto.mapToView);

  //   return items;
  // }
}
