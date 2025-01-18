import { ReactionModelStatus } from '../api/enums/ReactionStatus';
import { ReactionEntityType } from '../api/enums/ReactionEntityType';

export class Reaction {
  id: string;
  userId: string;
  entityId: string;
  reactionStatus: ReactionModelStatus;
  entityType: ReactionEntityType;
  createdAt: Date;
}
