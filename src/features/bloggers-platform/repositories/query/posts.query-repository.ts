import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostQueryGetParams } from '../../api/input-dto/get-posts-query.dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { ReactionStatus } from '../../api/enums/ReactionStatus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blog } from '../../domain/blog.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllPostsForBlog(
    query: PostQueryGetParams,
    blogId: string,
    userId?: string,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    const checkBlogQuery = `
      SELECT id
      FROM blogs
      WHERE blogs.id = $1
      `;

    const result: Blog[] = await this.dataSource.query(checkBlogQuery, [
      blogId,
    ]);
    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'Blog not found while get posts',
          field: 'blogId',
        },
      ]);
    }

    const { sortBy, sortDirection, pageSize } = query;

    const sqlQuery = `
      SELECT p.id, p.title, p.short_description as "shortDescription", p.content, blogs.id as "blogId",
      blogs.name as "blogName", p.created_at as "createdAt" ${userId ? ', reactions.reaction_status as "reactionStatus"' : ''}
      FROM posts as p
      LEFT JOIN blogs ON blogs.id = p.blog_id
      ${userId ? `LEFT JOIN reactions ON reactions.user_id = '${userId}' AND reactions.entity_id = p.id` : ''}
      WHERE blogs.id = $1
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()}
    `;

    const posts: Post[] = await this.dataSource.query(`${sqlQuery};`, [blogId]);

    const postIds = posts.map((post) => "'" + post.id + "'").join(',');

    const likesDislikesQuery = `
        SELECT p.id as "postId",
	      COUNT (CASE WHEN r.reaction_status = 'Like' THEN 1 END) as "likesCount",
	      COUNT (CASE WHEN r.reaction_status = 'Dislike' THEN 1 END) as "dislikesCount"
        FROM posts p
        LEFT JOIN reactions r ON r.entity_id = p.id
        WHERE p.id IN (${postIds})
        GROUP BY "postId", r.reaction_status;
    `;

    const likesDislikesResult = await this.dataSource.query(likesDislikesQuery);

    const totalCount = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM (
          SELECT p.id
          FROM posts as p
          LEFT JOIN blogs ON blogs.id = p.blog_id
          WHERE blogs.id = $1
      ) as subquery;
      `,
      [blogId],
    );

    const lastLikesQuery = `
        WITH RankedReactions AS (
    SELECT 
        id,
        entity_id,
        reaction_status,
        ROW_NUMBER() OVER (PARTITION BY entity_id ORDER BY created_at DESC) AS row_num
    FROM 
        reactions
    WHERE 
        entity_id IN (${postIds}) AND reaction_status = 'Like'
)
SELECT 
    id, 
    entity_id as "postId", 
    reaction_status as "reactionStatus"
FROM 
    RankedReactions
WHERE 
    row_num <= 3
ORDER BY 
    entity_id, row_num;
    `;

    const lastLikesResult = await this.dataSource.query(lastLikesQuery);

    const items = posts.map((post: any, index) => {
      return PostViewDto.mapToView(
        post,
        post.reactionStatus,
        likesDislikesResult.find((obj) => obj.postId === post.id),
        lastLikesResult[0][index],
      );
    });

    return BasePaginationViewDto.mapToView({
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length === 0 ? 0 : Number(totalCount[0].count),
      items,
    });
  }

  async getAllPosts(
    query: PostQueryGetParams,
    userId?: string,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    const { sortBy, sortDirection, pageSize } = query;

    const sqlQuery = `
      SELECT p.id, p.title, p.short_description as "shortDescription", p.content, blogs.id as "blogId",
      blogs.name as "blogName", p.created_at as "createdAt" ${userId ? ', reactions.reaction_status as "reactionStatus"' : ''}
      FROM posts as p
      LEFT JOIN blogs ON blogs.id = p.blog_id
      ${userId ? `LEFT JOIN reactions ON reactions.user_id = '${userId}' AND reactions.entity_id = p.id` : ''}
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()}
    `;

    const posts: Post[] = await this.dataSource.query(`${sqlQuery};`);

    const postIds = posts.map((post) => "'" + post.id + "'").join(',');

    const likesDislikesQuery = `
        SELECT p.id as "postId",
	      COUNT (CASE WHEN r.reaction_status = 'Like' THEN 1 END) as "likesCount",
	      COUNT (CASE WHEN r.reaction_status = 'Dislike' THEN 1 END) as "dislikesCount"
        FROM posts p
        LEFT JOIN reactions r ON r.entity_id = p.id
        WHERE p.id IN (${postIds})
        GROUP BY "postId", r.reaction_status;
    `;

    const likesDislikesResult = await this.dataSource.query(likesDislikesQuery);

    const totalCount = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM (
          SELECT p.id
          FROM posts as p
          LEFT JOIN blogs ON blogs.id = p.blog_id
      ) as subquery;
      `,
    );

    const lastLikesQuery = `
        WITH RankedReactions AS (
    SELECT 
        r.entity_id,
        r.reaction_status,
        r.created_at,
        u.id,
        u.login,
        ROW_NUMBER() OVER (PARTITION BY entity_id ORDER BY r.created_at DESC) AS row_num
    FROM 
        reactions r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE 
        r.entity_id IN (${postIds}) AND r.reaction_status = 'Like'
    )
    SELECT 
        entity_id as "postId", 
        reaction_status as "reactionStatus",
        created_at as "addedAt",
        id as "userId",
        login
    FROM RankedReactions
    WHERE 
        row_num <= 3
    ORDER BY 
        entity_id, row_num;
    `;

    const lastLikesResult = await this.dataSource.query(lastLikesQuery);

    const items = posts.map((post: any) => {
      return PostViewDto.mapToView(
        post,
        post.reactionStatus,
        likesDislikesResult.find((obj) => obj.postId === post.id),
        lastLikesResult.filter((obj) => obj.postId === post.id),
      );
    });

    return BasePaginationViewDto.mapToView({
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length === 0 ? 0 : Number(totalCount[0].count),
      items,
    });
  }

  async getByIdOrThrow(id: string, userId?: string): Promise<PostViewDto> {
    const query = `
      SELECT posts.id as "id", posts.title as "title",
      posts.content as "content", posts.blog_id as "blogId", posts.short_description as "shortDescription",
      blogs.name as "blogName", posts.created_at as "createdAt" ${userId ? ', reactions.reaction_status as "reactionStatus"' : ''}
      FROM posts
      LEFT JOIN blogs ON blogs.id = posts.blog_id
      ${userId ? `LEFT JOIN reactions ON reactions.user_id = '${userId}'` : ''}
      WHERE posts.id = $1
    `;

    const result: any[] = await this.dataSource.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'User not found',
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

    // GET LAST 3 LIKES

    const lastLikesQuery = `
        SELECT u.id, u.login, r.created_at as "addedAt"
        FROM reactions r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.entity_id = $1
        ORDER BY "addedAt" DESC
        LIMIT 3;
    `;

    const lastLikesResult = await this.dataSource.query(lastLikesQuery, [id]);

    return PostViewDto.mapToView(
      result[0],
      result[0].reactionStatus,
      likesDislikesResult[0],
      lastLikesResult,
    );
  }
}
