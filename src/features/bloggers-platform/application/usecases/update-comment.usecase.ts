import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../repositories/comments.repository';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';

export class UpdateCommentCommand {
  constructor(public dto: UpdateCommentDto) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand, void>
{
  constructor(
    private commentRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const dto = command.dto;

    const user = await this.usersRepository.findById(dto.userId);
    if (!user) {
      throw new UnauthorizedException([
        {
          message: 'User not found',
          field: 'userId',
        },
      ]);
    }
    const comment = await this.commentRepository.getByIdOrThrow(dto.commentId);

    if (comment.commentatorId !== user.id) {
      throw new ForbiddenException([
        {
          message: 'You try to edit not your comment',
          field: 'commentId',
        },
      ]);
    }

    await this.commentRepository.updateCommentContent(comment.id, dto.content);
  }
}
