import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { CreateBlogInput } from '../../src/features/bloggers-platform/api/input-dto/create-blog-input.dto';
import { API_PREFIX } from '../../src/settings/global-prefix.setup';
import { BlogViewDto } from '../../src/features/bloggers-platform/api/view-dto/blog.view-dto';
import { delay } from './delay';
import { basicAuthHeader } from './users-test-manager';

export class BlogsTestManager {
  constructor(private app: INestApplication) {}
  async createBlog(
    createModel: CreateBlogInput,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<BlogViewDto> {
    const response = await request(this.app.getHttpServer())
      .post(`${API_PREFIX}/blogs`)
      .send(createModel)
      .set('authorization', basicAuthHeader)
      .expect(statusCode);

    return response.body;
  }

  async createBlogs(count: number) {
    const blogsPromises = [] as Promise<BlogViewDto>[];

    for (let i = 0; i < count; ++i) {
      await delay(50);
      const response = this.createBlog({
        name: `BlogNametor ` + i,
        description: `test${i}description`,
        websiteUrl: `https://google${i}.com`,
      });
      blogsPromises.push(response);
    }

    return Promise.all(blogsPromises);
  }
}
