import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsQueryRepository } from './repositories/query/blogs.query-repository';
import { UserPlatformModule } from '../user-platform/user-platform.module';
import { BlogIsExistConstraint } from './validation/blog-is-exist.decorator';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { PostsQueryRepository } from './repositories/query/posts.query-repository';

@Module({
  imports: [UserPlatformModule],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogIsExistConstraint,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
