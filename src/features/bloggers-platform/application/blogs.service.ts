import { Injectable } from '@nestjs/common';
import { CreateBlogInput } from '../api/input-dto/create-blog-input.dto';
import { UpdateBlogInput } from '../api/input-dto/update-blog-input.dto';
import { BlogsRepository } from '../repositories/blogs.repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogInput): Promise<string> {
    const blogDto: CreateBlogDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
    };

    const blogId = await this.blogsRepository.createBlog(blogDto);

    return blogId;
  }

  async editBlog(id: string, dto: UpdateBlogInput) {
    const blog = await this.blogsRepository.getByIdOrThrow(id);

    const blogDto: UpdateBlogDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: blog.isMembership,
    };

    await this.blogsRepository.updateBlog(id, blogDto);
  }

  async deleteBlog(id: string): Promise<void> {
    const blog = await this.blogsRepository.getByIdOrThrow(id);

    await this.blogsRepository.delete(blog.id);
  }
}
