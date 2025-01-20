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
  ): Promise<Reaction | null> {
    const result = await this.dataSource.query(
      `
        SELECT *
        FROM reactions
        WHERE reactions.user_id = $1 AND reactions.entity_id = $2
    `,
      [userId, entityId],
    );

    if (result.length === 0) {
      return null;
    }

    return result[0];
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

  async updateReaction(reactionId: string, reactionStatus: ReactionDbStatus) {
    const query = `
      UPDATE reactions
      SET reaction_status = $2, created_at = now()
      WHERE reactions.id = $1;
    `;

    await this.dataSource.query(query, [reactionId, reactionStatus]);
  }

  async deleteReaction(reactionId: string) {
    const query = `
      DELETE FROM reactions
      WHERE reactions.id = $1;
    `;

    await this.dataSource.query(query, [reactionId]);
  }
}
