import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

import { Blog } from '../../domain/blog.entity';
import { BlogQueryGetParams } from '../../api/input-dto/get-blogs-query.dto';

import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getByIdOrThrow(id: string): Promise<BlogViewDto> {
    // const blog = await this.BlogModel.findById(id);
    //
    // if (!blog) {
    //   throw new NotFoundException([
    //     {
    //       message: 'Blog not found',
    //       field: 'id',
    //     },
    //   ]);
    // }
    //
    // return BlogViewDto.mapToView(blog);
    return {} as any;
  }

  async getAll(
    query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    //   const filter: FilterQuery<Blog> = {};
    //
    //   if (query.searchNameTerm) {
    //     filter.$or = filter.$or || [];
    //     filter.$or.push({
    //       name: { $regex: query.searchNameTerm, $options: 'i' },
    //     });
    //   }
    //
    //   const blogs = await this.BlogModel.find({
    //     ...filter,
    //   })
    //     .sort({ [query.sortBy]: query.sortDirection })
    //     .skip(query.calculateSkip())
    //     .limit(query.pageSize);
    //
    //   const totalCount = await this.BlogModel.countDocuments(filter);
    //
    //   const items = blogs.map(BlogViewDto.mapToView);
    //
    //   return BasePaginationViewDto.mapToView({
    //     page: query.pageNumber,
    //     pageSize: query.pageSize,
    //     totalCount,
    //     items,
    //   });
    return [] as any;
  }
}
