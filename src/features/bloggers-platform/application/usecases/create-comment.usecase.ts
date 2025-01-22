import { CreateCommentDto } from '../../dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Promise } from 'mongoose';
import { CommentsRepository } from '../../repositories/comments.repository';
import { PostsRepository } from '../../repositories/posts.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';

export class CreateCommentCommand {
  constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand, string>
{
  constructor(
    private commentRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const dto = command.dto;

    const post = await this.postsRepository.getById(dto.postId);
    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post for a comment not found',
          field: 'postId',
        },
      ]);
    }

    const user = await this.usersRepository.findById(dto.userId);
    if (!user) {
      throw new UnauthorizedException([
        {
          message: 'User not found',
          field: 'userId',
        },
      ]);
    }

    const commentId = await this.commentRepository.createComment(dto);

    return commentId;
  }
}
