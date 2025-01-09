import { OmitType } from '@nestjs/swagger';

export class UserViewDto {
  id: number;
  login: string;
  email: string;
  createdAt: Date;

  static mapToView(user: any): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id;
    dto.email = user.email;
    dto.login = user.login;
    dto.createdAt = user.createdAt;

    return dto;
  }
}

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: string;

  // TODO: change typing
  static mapToView(user: any): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id;

    return dto;
  }
}
