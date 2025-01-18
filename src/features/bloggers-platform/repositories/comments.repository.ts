import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '../domain/comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

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

  // async getById(id: string) {
  //   // return this.CommentModel.findById(id);
  //   return {} as any;
  // }

  async deleteComment(id: string) {
    await this.dataSource.query(
      `
      DELETE FROM comments
      WHERE comments.id = $1
    `,
      [id],
    );
  }

  async updateCommentContent(id: string, content: string) {
    const query = `
        UPDATE comments
        SET content = $1
        WHERE comments.id = $2;
    `;

    await this.dataSource.query(query, [content, id]);
  }

  async getByIdOrThrow(id: string) {
    const result = await this.dataSource.query(
      `
    SELECT comments.id, comments.commentator_id as "commentatorId"
    FROM comments
    WHERE comments.id = $1
    `,
      [id],
    );

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
          field: 'id',
        },
      ]);
    }

    return result[0];
  }
}
