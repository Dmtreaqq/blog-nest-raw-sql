import { IsOptional, IsUUID } from 'class-validator';

export class IdInputDto {
  @IsUUID()
  id: string;

  @IsUUID()
  @IsOptional()
  postId: string;
}
