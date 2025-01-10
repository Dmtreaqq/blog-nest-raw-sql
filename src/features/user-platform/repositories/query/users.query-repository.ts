import { User } from '../../domain/user.entity';

import { UserViewDto } from '../../api/view-dto/users.view-dto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getByIdOrThrow(id: string): Promise<UserViewDto> {
    const query = `
      SELECT id, login, email, created_at as "createdAt"
      FROM users
      WHERE users.id = $1;
    `;

    const user = await this.dataSource.query(query, [id]);

    if (user.length === 0) {
      throw new NotFoundException([
        {
          message: 'User not found',
          field: 'id',
        },
      ]);
    }

    return UserViewDto.mapToView(user[0]);
  }

  async getAll(
    query: GetUsersQueryParams,
  ): Promise<BasePaginationViewDto<UserViewDto[]>> {
    const {
      sortBy,
      searchEmailTerm,
      searchLoginTerm,
      sortDirection,
      pageSize,
    } = query;

    const sqlQuery = `
      SELECT id, login, email, created_at as "createdAt"
      FROM users
      WHERE login ILIKE $1
      OR email ILIKE $2
      ORDER BY "${sortBy}" ${sortDirection}
      LIMIT ${pageSize}
      OFFSET ${query.calculateSkip()};
    `;

    const users = await this.dataSource.query(sqlQuery, [
      `%${searchLoginTerm ? searchLoginTerm : ''}%`,
      `%${searchEmailTerm ? searchEmailTerm : ''}%`,
    ]);

    // const totalCount = await this.dataSource.query(
    //   `SELECT COUNT(*) FROM users;`,
    // );

    const items: UserViewDto[] = users.map(UserViewDto.mapToView);

    return BasePaginationViewDto.mapToView({
      items,
      totalCount: users.length,
      page: query.pageNumber,
      pageSize: query.pageSize,
    });
  }
}
