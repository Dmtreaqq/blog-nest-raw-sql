import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostQueryGetParams } from '../../api/input-dto/get-posts-query.dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import {
  ReactionModelStatus,
  ReactionStatus,
} from '../../api/enums/ReactionStatus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { isUUID } from 'class-validator';
import { Blog } from '../../domain/blog.entity';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

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
      blogs.name as "blogName", p.created_at as "createdAt"
      FROM posts as p
      LEFT JOIN blogs ON blogs.id = p.blog_id
      WHERE blogs.id = $1
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()}
    `;

    const posts: Post[] = await this.dataSource.query(`${sqlQuery};`, [blogId]);

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

    const items = posts.map((post) => {
      return PostViewDto.mapToView(post, null);
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
      blogs.name as "blogName", p.created_at as "createdAt"
      FROM posts as p
      LEFT JOIN blogs ON blogs.id = p.blog_id
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()}
    `;

    const posts: Post[] = await this.dataSource.query(`${sqlQuery};`);

    const totalCount = await this.dataSource.query(
      `
      SELECT COUNT(*) FROM (
          SELECT p.id
          FROM posts as p
          LEFT JOIN blogs ON blogs.id = p.blog_id
      ) as subquery;
      `,
    );

    const items = posts.map((post) => {
      return PostViewDto.mapToView(post, null);
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
      blogs.name as "blogName", posts.created_at as "createdAt"
      FROM posts
      LEFT JOIN blogs ON blogs.id = posts.blog_id
      WHERE posts.id = $1
    `;

    const result: PostViewDto[] = await this.dataSource.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'User not found',
          field: 'id',
        },
      ]);
    }

    return PostViewDto.mapToView(result[0], null);
    //
    //   let userPostReactionStatus: ReactionModelStatus | null = null;
    //   if (userId) {
    //     const user = await this.UserModel.findById(userId);
    //     if (user && user.userReactions?.length > 0) {
    //       const userPostReaction = user.userReactions.find(
    //         (userReact) => userReact.commentOrPostId === post.id,
    //       );
    //
    //       userPostReactionStatus = userPostReaction?.status;
    //     }
    //   }
    //
    //   return PostViewDto.mapToView(post, userPostReactionStatus as any);
  }
}
