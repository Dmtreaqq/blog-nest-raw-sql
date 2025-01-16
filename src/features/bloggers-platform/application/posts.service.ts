import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostInputDto } from '../api/input-dto/create-post-input.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import { PostsRepository } from '../repositories/posts.repository';
import { BlogsRepository } from '../repositories/blogs.repository';
import { UpdatePostInputDto } from '../api/input-dto/update-post-input.dto';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPostForBlog(
    dto: Omit<CreatePostInputDto, 'blogId'> | CreatePostInputDto,
    blogId: string,
  ): Promise<string> {
    const blog = await this.blogsRepository.getByIdOrThrow(blogId);

    const postDto: CreatePostDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog.id,
      blogName: blog.name,
    };

    const postId = await this.postsRepository.createPost(postDto);

    return postId;
  }

  async editPost(blogId: string, postId: string, dto: UpdatePostInputDto) {
    const isBlogExist = await this.blogsRepository.blogIsExist(blogId);
    if (!isBlogExist) {
      throw new NotFoundException('Blog not exist');
    }

    const post = await this.postsRepository.getByIdOrThrow(postId);

    const postEditDto: UpdatePostDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    };

    await this.postsRepository.updatePost(post.id, postEditDto);
  }

  async deletePost(blogId: string, postId: string): Promise<void> {
    const isBlogExist = await this.blogsRepository.blogIsExist(blogId);
    if (!isBlogExist) {
      throw new NotFoundException('Blog not exist');
    }

    const post = await this.postsRepository.getByIdOrThrow(postId);

    await this.postsRepository.delete(post.id);
  }
}
