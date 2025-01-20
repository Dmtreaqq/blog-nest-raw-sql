import { ReactionDbStatus } from '../api/enums/ReactionStatus';
import { ReactionEntityType } from '../api/enums/ReactionEntityType';

export class Reaction {
  id: string;
  userId: string;
  entityId: string;
  reactionStatus: ReactionDbStatus;
  entityType: ReactionEntityType;
  createdAt: Date;
}
