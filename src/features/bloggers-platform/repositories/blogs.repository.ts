import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from '../domain/blog.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(blogDto: CreateBlogDto): Promise<string> {
    const { name, description, websiteUrl, isMembership } = blogDto;

    const query = `
      INSERT INTO blogs (name, description, website_url, is_membership)
      VALUES ($1, $2, $3, ${isMembership})
      RETURNING id;
    `;
    const blog = await this.dataSource.query(query, [
      name,
      description,
      websiteUrl,
    ]);

    return blog[0].id;
  }

  async updateBlog(id: string, dto: UpdateBlogDto) {
    const { name, websiteUrl, description, isMembership } = dto;

    const query = `
        UPDATE blogs
        SET name = '${name}', website_url = '${websiteUrl}', description = '${description}',
        is_membership = ${isMembership}
        WHERE blogs.id = $1;
    `;


    await this.dataSource.query(query, [id]);
  }

  async getByIdOrThrow(id: string): Promise<Blog> {
    const result = await this.dataSource.query(
      `
    SELECT website_url as "websiteUrl", is_membership as "isMembership", created_at as "createdAt",
    id, name, description
    FROM blogs
    WHERE blogs.id = $1
    `,
      [id],
    );

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
          field: 'id',
        },
      ]);
    }

    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query(
      `
      DELETE FROM blogs
      WHERE blogs.id = $1
    `,
      [id],
    );
  }

  async blogIsExist(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      SELECT id
      FROM blogs
      WHERE blogs.id = $1;
    `,
      [id],
    );

    if (result.length === 0) return false;

    return true;
  }
}
