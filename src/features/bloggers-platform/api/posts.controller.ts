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
import { PostViewDto } from './view-dto/post.view-dto';
import { PostsQueryRepository } from '../repositories/query/posts.query-repository';
import { PostsService } from '../application/posts.service';
import { CreatePostInputDto } from './input-dto/create-post-input.dto';
import { PostQueryGetParams } from './input-dto/get-posts-query.dto';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { UpdatePostInputDto } from './input-dto/update-post-input.dto';
// import { CommentsQueryRepository } from '../repositories/query/comments.query-repository';
// import { CommentsQueryGetParams } from './input-dto/get-comments-query.dto';
import { IdInputDto } from '../../../common/dto/id.input-dto';
// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// import { CreateCommentInputDto } from './input-dto/create-comment-input.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserContext } from '../../../common/dto/user-context.dto';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { JwtOptionalAuthGuard } from '../../../common/guards/jwt-optional-auth.guard';
// import { PostsRepository } from '../repositories/posts.repository';

@Controller('sa/posts')
export class AdminPostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    // private postsRepository: PostsRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() dto: CreatePostInputDto) {
    const postId = await this.postsService.createPostForBlog(dto, dto.blogId);

    return this.postsQueryRepository.getByIdOrThrow(postId);
  }
}

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    // private postsRepository: PostsRepository,
  ) {}

  // @UseGuards(JwtOptionalAuthGuard)
  // @Get(':id/comments')
  // async getCommentsForPost(
  //   @Param() params: IdInputDto,
  //   @Query() query: CommentsQueryGetParams,
  //   @GetUser() userContext: UserContext,
  // ) {
  //   return this.commentsQueryRepository.getAll(
  //     query,
  //     params.id,
  //     userContext.id,
  //   );
  // }

  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  async getAll(
    @Query() query: PostQueryGetParams,
    @GetUser() userContext: UserContext,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAllPosts(query, userContext.id);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getById(
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrThrow(params.id, userContext.id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post(':id/comments')
  // async createCommentForPost(
  //   @Body() commentInputDto: CreateCommentInputDto,
  //   @Param() params: IdInputDto,
  //   @GetUser() userContext: UserContext,
  // ) {
  //   const commentId = await this.commandBus.execute(
  //     new CreateCommentCommand({
  //       ...commentInputDto,
  //       postId: params.id,
  //       userId: userContext.id,
  //     }),
  //   );
  //
  //   return this.commentsQueryRepository.getByIdOrThrow(commentId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Put(':id/like-status')
  // async setLikeStatus(
  //   @Param() params: IdInputDto,
  //   @GetUser() userContext: UserContext,
  //   @Body() dto: CreateUpdateReactionInput,
  // ) {
  //   await this.commandBus.execute(
  //     new UpdateReactionCommand({
  //       userId: userContext.id,
  //       commentOrPostId: params.id,
  //       reactionStatus: dto.likeStatus,
  //       reactionRelationType: ReactionRelationType.Post,
  //     }),
  //   );
  // }
}
