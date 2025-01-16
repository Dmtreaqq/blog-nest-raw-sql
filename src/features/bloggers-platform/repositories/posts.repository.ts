import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const { title, shortDescription, content, blogName, blogId } = dto;

    const query = `
    INSERT INTO posts (title, short_description, content, blog_name, blog_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `;

    const result = await this.dataSource.query(query, [
      title,
      shortDescription,
      content,
      blogName,
      blogId,
    ]);

    return result[0].id;
  }

  async getById(id: string): Promise<Post | null> {
    // return this.PostModel.findById(id);
    return {} as any;
  }

  async getByIdOrThrow(id: string): Promise<Post> {
    const result: Post[] = await this.dataSource.query(
      `
    SELECT id
    FROM posts
    WHERE posts.id = $1
    `,
      [id],
    );

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'Post not found',
          field: 'id',
        },
      ]);
    }

    return result[0];
  }

  async delete(id: string): Promise<void> {
    const query = `
      DELETE FROM posts
      WHERE posts.id = $1;
    `;

    await this.dataSource.query(query, [id]);
  }

  async updatePost(id: string, dto: UpdatePostDto) {
    const { content, shortDescription, title } = dto;

    const query = `
        UPDATE posts
        SET content = '${content}', short_description = '${shortDescription}',
        title = '${title}'
        WHERE posts.id = $1;
    `;

    await this.dataSource.query(query, [id]);
  }
}
