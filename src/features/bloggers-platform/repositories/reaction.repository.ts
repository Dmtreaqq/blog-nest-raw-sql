import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Reaction } from '../domain/reaction.entity';
import { ReactionEntityType } from '../api/enums/ReactionEntityType';
import { ReactionDbStatus } from '../api/enums/ReactionStatus';
import { CreateReactionDto } from '../dto/create-reaction.dto';

@Injectable()
export class ReactionRepository {
  constructor(private dataSource: DataSource) {}

  async findReactionByUserIdAndEntityId(
    userId: string,
    entityId: string,
    entityType: ReactionEntityType,
  ): Promise<Reaction | null> {
    return null;
  }

  async createReaction(reactionDto: CreateReactionDto) {
    const { userId, entityId, entityType, reactionStatus } = reactionDto;

    const query = `
      INSERT INTO reactions
      (user_id, entity_id, entity_type, reaction_status)
      VALUES ($1, $2, $3, $4)
    `;

    await this.dataSource.query(query, [
      userId,
      entityId,
      entityType,
      reactionStatus,
    ]);
  }
}
