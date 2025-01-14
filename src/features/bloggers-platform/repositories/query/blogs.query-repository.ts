import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Blog } from '../../domain/blog.entity';
import { BlogQueryGetParams } from '../../api/input-dto/get-blogs-query.dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getByIdOrThrow(id: string): Promise<BlogViewDto> {
    const query = `
      SELECT website_url as "websiteUrl", is_membership as "isMembership", created_at as "createdAt",
      id, name, description
      FROM blogs
      WHERE blogs.id = $1;
    `;

    const result: Blog[] = await this.dataSource.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
          field: 'id',
        },
      ]);
    }

    return BlogViewDto.mapToView(result[0]);
  }

  async getAll(
    query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    const { sortBy, searchNameTerm, sortDirection, pageSize } = query;

    const sqlQuery = `
      SELECT website_url as "websiteUrl", is_membership as "isMembership", created_at as "createdAt",
      id, name, description
      FROM blogs
      WHERE name ILIKE $1
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()}
    `;

    const blogs: Blog[] = await this.dataSource.query(`${sqlQuery};`, [
      `%${searchNameTerm || ''}%`,
    ]);

    let totalCount;

    if (!searchNameTerm) {
      totalCount = await this.dataSource.query(`
      SELECT COUNT(*) FROM blogs;
      `);
    } else {
      totalCount = await this.dataSource.query(
        `SELECT COUNT(*) FROM (
            SELECT id
            FROM blogs
            WHERE name ILIKE $1
         ) AS subquery;`,
        [`%${searchNameTerm || ''}%`],
      );
    }

    const items = blogs.map(BlogViewDto.mapToView);

    return BasePaginationViewDto.mapToView({
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length === 0 ? 0 : Number(totalCount[0].count),
      items,
    });
  }
}
