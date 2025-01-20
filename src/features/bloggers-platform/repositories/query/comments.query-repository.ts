import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { CommentsQueryGetParams } from '../../api/input-dto/get-comments-query.dto';
import { Comment } from '../../domain/comment.entity';
import { ReactionStatus } from '../../api/enums/ReactionStatus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAll(
    query: CommentsQueryGetParams,
    postId: string,
    userId?: string,
  ): Promise<BasePaginationViewDto<CommentViewDto[]>> {
    const { sortBy, sortDirection, pageSize } = query;

    const postResult = await this.dataSource.query(
      `
      SELECT id
      FROM posts
      WHERE posts.id = $1
    `,
      [postId],
    );
    if (postResult.length === 0) {
      throw new NotFoundException();
    }

    const sqlQuery = `
      SELECT comments.id, comments.created_at as "createdAt", comments.commentator_id as "commentatorId",
      users.login, comments.content ${userId ? ', reactions.reaction_status as "reactionStatus"' : ''}
      FROM comments
      LEFT JOIN users ON comments.commentator_id = users.id
      ${userId ? `LEFT JOIN reactions ON reactions.user_id = '${userId}' AND reactions.entity_id = comments.id` : ''}
      WHERE comments.post_id = $1
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()}
      `;

    const comments: Comment[] = await this.dataSource.query(sqlQuery, [postId]);
    const commentIds = comments.map((comm) => "'" + comm.id + "'").join(',');

    const likesDislikesQuery = `
        SELECT c.id as "commentId",
	      COUNT (CASE WHEN r.reaction_status = 'Like' THEN 1 END) as "likesCount",
	      COUNT (CASE WHEN r.reaction_status = 'Dislike' THEN 1 END) as "dislikesCount"
        FROM comments c
        LEFT JOIN reactions r ON r.entity_id = c.id
        WHERE c.id IN (${commentIds})
        GROUP BY "commentId", r.reaction_status;
    `;

    const likesDislikesResult = await this.dataSource.query(likesDislikesQuery);

    const totalCount = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM (
        SELECT comments.id
        FROM comments
        LEFT JOIN users ON comments.commentator_id = users.id
        WHERE comments.post_id = $1
      ) as subquery;
    `,
      [postId],
    );

    const items = comments.map((comm: any, index) =>
      CommentViewDto.mapToView(
        comm,
        comm.reactionStatus,
        likesDislikesResult.find((obj) => obj.commentId === comm.id),
      ),
    );

    return BasePaginationViewDto.mapToView({
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length === 0 ? 0 : Number(totalCount[0].count),
      items,
    });
  }

  async getByIdOrThrow(id: string, userId?: string): Promise<CommentViewDto> {
    const query = `
      SELECT comments.id, comments.created_at as "createdAt", comments.commentator_id as "commentatorId",
      users.login, comments.content ${userId ? ', reactions.reaction_status as "reactionStatus"' : ''}
      FROM comments
      LEFT JOIN users ON comments.commentator_id = users.id
      ${userId ? `LEFT JOIN reactions ON reactions.user_id = '${userId}' AND reactions.entity_id = comments.id` : ''}
      WHERE comments.id = $1;
    `;

    const result: any = await this.dataSource.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
          field: 'id',
        },
      ]);
    }

    // COUNT LIKES AND DISLIKES FOR COMMENT
    const likesDislikesQuery = `
      SELECT
        COUNT (CASE WHEN reaction_status = '${ReactionStatus.Like}' THEN 1 END) as "likesCount",
        COUNT (CASE WHEN reaction_status = '${ReactionStatus.Dislike}' THEN 1 END) as "dislikesCount"
      FROM reactions
      WHERE reactions.entity_id = $1;
    `;

    const likesDislikesResult = await this.dataSource.query(
      likesDislikesQuery,
      [id],
    );

    return CommentViewDto.mapToView(
      result[0],
      result[0].reactionStatus,
      likesDislikesResult[0],
    );
  }
}
