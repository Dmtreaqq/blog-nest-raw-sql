import { ReactionEntityType } from '../api/enums/ReactionEntityType';
import { ReactionDbStatus } from '../api/enums/ReactionStatus';

export class CreateReactionDto {
  userId: string;
  entityId: string;
  entityType: ReactionEntityType;
  reactionStatus: ReactionDbStatus;
}
