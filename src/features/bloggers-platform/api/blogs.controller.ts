import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogInput } from './input-dto/create-blog-input.dto';
import { BlogsService } from '../application/blogs.service';
import { UpdateBlogInput } from './input-dto/update-blog-input.dto';
import { BlogsQueryRepository } from '../repositories/query/blogs.query-repository';
import { BlogQueryGetParams } from './input-dto/get-blogs-query.dto';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { CreatePostForBlogInputDto } from './input-dto/create-post-input.dto';
import { JwtOptionalAuthGuard } from '../../../common/guards/jwt-optional-auth.guard';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserContext } from '../../../common/dto/user-context.dto';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/query/posts.query-repository';
import { PostQueryGetParams } from './input-dto/get-posts-query.dto';
import { UpdatePostInputDto } from './input-dto/update-post-input.dto';

@Controller('sa/blogs')
export class AdminBlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAll(
    @Query() query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @UseGuards(BasicAuthGuard)
  @Get(':id/posts')
  async getPostsForBlog(
    @Query() query: PostQueryGetParams,
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
  ) {
    return this.postsQueryRepository.getAllPostsForBlog(
      query,
      params.id,
      userContext.id,
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async createPostForBlog(
    @Body() dto: CreatePostForBlogInputDto,
    @Param() param: IdInputDto,
  ) {
    const postId = await this.postsService.createPostForBlog(dto, param.id);

    return this.postsQueryRepository.getByIdOrThrow(postId);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() dto: CreateBlogInput) {
    const blogId = await this.blogsService.createBlog(dto);

    return this.blogsQueryRepository.getByIdOrThrow(blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editBlog(@Param() params: IdInputDto, @Body() dto: UpdateBlogInput) {
    return this.blogsService.editBlog(params.id, dto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() params: IdInputDto) {
    await this.blogsService.deleteBlog(params.id);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(@Param() params: IdInputDto) {
    await this.postsService.deletePost(params.id, params.postId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editPost(@Param() params: IdInputDto, @Body() dto: UpdatePostInputDto) {
    return this.postsService.editPost(params.id, params.postId, dto);
  }
}

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id/posts')
  async getPostsForBlog(
    @Query() query: PostQueryGetParams,
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
  ) {
    return this.postsQueryRepository.getAllPostsForBlog(
      query,
      params.id,
      userContext.id,
    );
  }

  @Get()
  async getAll(
    @Query() query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param() params: IdInputDto) {
    return this.blogsQueryRepository.getByIdOrThrow(params.id);
  }
}
