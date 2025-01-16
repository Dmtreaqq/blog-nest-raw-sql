import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { Trim } from '../../../../common/decorators/custom-trim.decorator';

export class UpdatePostInputDto {
  @MaxLength(30)
  @IsNotEmpty()
  @Trim()
  @IsString()
  title: string;

  @MaxLength(100)
  @IsNotEmpty()
  @Trim()
  @IsString()
  shortDescription: string;

  @MaxLength(1000)
  @IsNotEmpty()
  @Trim()
  @IsString()
  content: string;
}
