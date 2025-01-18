import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '../domain/comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createComment(commentDto: CreateCommentDto): Promise<string> {
    const { userId, postId, content } = commentDto;

    const query = `
      INSERT INTO comments (commentator_id, post_id, content)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const comment: Comment[] = await this.dataSource.query(query, [
      userId,
      postId,
      content,
    ]);

    return comment[0].id;
  }

  async getById(id: string) {
    // return this.CommentModel.findById(id);
    return {} as any;
  }

  async deleteComment(comment: Comment) {
    // const result = await comment.deleteOne();
    //
    // if (result.deletedCount !== 1) {
    //   throw new BadRequestException([
    //     {
    //       message: 'Entity was not deleted for some reason',
    //       field: 'id',
    //     },
    //   ]);
    // }

    return {} as any;
  }

  async getByIdOrThrow(id: string) {
    // const comment = await this.CommentModel.findById(id);
    //
    // if (!comment) {
    //   throw new NotFoundException([
    //     {
    //       message: 'Comment not found',
    //       field: 'id',
    //     },
    //   ]);
    // }
    //
    // return comment;
    return {} as any;
  }
}
