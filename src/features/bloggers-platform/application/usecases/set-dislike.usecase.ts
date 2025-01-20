import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentsRepository } from '../../repositories/comments.repository';
import { ReactionEntityType } from '../../api/enums/ReactionEntityType';
import { PostsRepository } from '../../repositories/posts.repository';
import { Comment } from '../../domain/comment.entity';
import { Post } from '../../domain/post.entity';
import { ReactionRepository } from '../../repositories/reaction.repository';
import { ReactionDbStatus } from '../../api/enums/ReactionStatus';
import { CreateReactionDto } from '../../dto/create-reaction.dto';

export class SetDislikeCommand {
  constructor(
    public userId: string,
    public entityId: string,
    public entityType: ReactionEntityType,
  ) {}
}

@CommandHandler(SetDislikeCommand)
export class SetDislikeUseCase
  implements ICommandHandler<SetDislikeCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private reactionRepository: ReactionRepository,
  ) {}

  async execute(command: SetDislikeCommand) {
    const { userId, entityId, entityType } = command;

    // CHECK IF USER VALID
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    // CHECK IF COMMENT OR POST EXIST
    let entity: Post | Comment | null = null;
    switch (entityType) {
      case ReactionEntityType.Post:
        entity = await this.postsRepository.getById(entityId);
        break;
      case ReactionEntityType.Comment:
        entity = await this.commentsRepository.getById(entityId);
        break;
    }

    if (!entity) {
      throw new NotFoundException();
    }

    // CHECK IF USER ALREADY LEFT A REACTION ON THIS POST or COMMENT
    const userReactionThisEntity =
      await this.reactionRepository.findReactionByUserIdAndEntityId(
        userId,
        entityId,
      );

    // IF USER DON'T HAVE A REACTION, CREATE A NEW ONE
    if (!userReactionThisEntity) {
      const reactionDtp: CreateReactionDto = {
        userId,
        entityId,
        entityType,
        reactionStatus: ReactionDbStatus.Dislike,
      };

      await this.reactionRepository.createReaction(reactionDtp);
      return;
    }

    // DONT DO ANYTHING IF TRY TO SET DISLIKE TWICE
    if (userReactionThisEntity.reactionStatus === ReactionDbStatus.Dislike) {
      return;
    }

    // IF USER HAVE REACTION AND ITS NOT SAME REACTION --- UPDATE IT
    if (userReactionThisEntity) {
      await this.reactionRepository.updateReaction(
        userReactionThisEntity.id,
        ReactionDbStatus.Dislike,
      );
    }
  }
}
