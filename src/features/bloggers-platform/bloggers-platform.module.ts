import { Module } from '@nestjs/common';
import { AdminBlogsController, BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsQueryRepository } from './repositories/query/blogs.query-repository';
import { UserPlatformModule } from '../user-platform/user-platform.module';
import { BlogIsExistConstraint } from './validation/blog-is-exist.decorator';
import { AdminPostsController, PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { PostsQueryRepository } from './repositories/query/posts.query-repository';
import { CommentsController } from './api/comments.controller';
import { CommentsRepository } from './repositories/comments.repository';
import { CommentsQueryRepository } from './repositories/query/comments.query-repository';
import { UpdateCommentUseCase } from './application/usecases/update-comment.usecase';
import { DeleteCommentUseCase } from './application/usecases/delete-comment.usecase';
import { CreateCommentUseCase } from './application/usecases/create-comment.usecase';
import { ReactionRepository } from './repositories/reaction.repository';
import { SetLikeUseCase } from './application/usecases/set-like.usecase';
import { SetDislikeUseCase } from './application/usecases/set-dislike.usecase';
import { SetNoneUseCase } from './application/usecases/set-none.usecase';

const useCases = [
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  SetLikeUseCase,
  SetDislikeUseCase,
  SetNoneUseCase,
];

@Module({
  imports: [UserPlatformModule],
  controllers: [
    BlogsController,
    PostsController,
    AdminBlogsController,
    AdminPostsController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogIsExistConstraint,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    ReactionRepository,
    ...useCases,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
