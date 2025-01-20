import { ReactionDbStatus } from '../api/enums/ReactionStatus';

export class UpdateReactionDto {
  userId: string;
  entityId: string;
  reactionStatus: ReactionDbStatus;
}
