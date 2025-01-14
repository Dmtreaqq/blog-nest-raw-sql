import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsQueryRepository } from './repositories/query/blogs.query-repository';
import { UserPlatformModule } from '../user-platform/user-platform.module';
import { BlogIsExistConstraint } from './validation/blog-is-exist.decorator';

@Module({
  imports: [UserPlatformModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogIsExistConstraint,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
