import { Injectable } from '@nestjs/common';
import { CreateBlogInput } from '../api/input-dto/create-blog-input.dto';
import { UpdateBlogInput } from '../api/input-dto/update-blog-input.dto';
import { BlogsRepository } from '../repositories/blogs.repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogInput): Promise<string> {
    // const blog = this.BlogModel.createInstance({
    //   name: dto.name,
    //   description: dto.description,
    //   websiteUrl: dto.websiteUrl,
    // });
    //
    // await this.blogsRepository.save(blog);
    //
    // return blog.id;
    return {} as any;
  }

  async editBlog(id: string, dto: UpdateBlogInput) {
    // const blog = await this.blogsRepository.getByIdOrThrow(id);
    //
    // blog.name = dto.name;
    // blog.description = dto.description;
    // blog.websiteUrl = dto.websiteUrl;
    //
    // await this.blogsRepository.save(blog);
    return {};
  }

  async deleteBlog(id: string): Promise<void> {
    // const blog = await this.blogsRepository.getByIdOrThrow(id);
    //
    // await this.blogsRepository.delete(blog);
    return {} as any;
  }
}
