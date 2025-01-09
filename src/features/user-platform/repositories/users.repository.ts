import { User } from '../domain/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  // async findById(id: string): Promise<any> {
  //   return this.UserModel.findById(id);
  // }

  // async findByConfirmationCode(code: string): Promise<any | null> {
  //   return this.UserModel.findOne({ confirmationCode: code });
  // }

  // async findByRecoveryCode(code: string): Promise<any | null> {
  //   return this.UserModel.findOne({ recoveryCode: code });
  // }

  async findByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<string | null> {
    const query = `
      SELECT id
      FROM users
      WHERE login = $1 OR email = $2
    `;

    const user = await this.dataSource.query(query, [login, email]);

    if (user.length === 0) return null;

    return user[0].id;
  }

  // async findByEmail(email: string): Promise<UserDocument | null> {
  //   return this.UserModel.findOne({ email });
  // }

  async create(values: CreateUserDto): Promise<string> {
    const { login, password, email, isConfirmed } = values;

    const query = `
      INSERT INTO users(login, password, email, is_confirmed)
      values('${login}', '${password}', '${email}', ${isConfirmed})
      RETURNING id;
    `;

    const result = await this.dataSource.query(query);

    return result[0].id;
  }

  async getByIdOrThrow(id: string): Promise<any> {
    const query = `
    SELECT *
    FROM users
    WHERE users.id = $1;
    `;

    const result = await this.dataSource.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException([
        {
          message: 'User not found',
          field: 'id',
        },
      ]);
    }

    return result[0];
  }

  async delete(id: string) {
    const query = `
      DELETE FROM users
      WHERE users.id = $1;
    `;

    await this.dataSource.query(query, [id]);
  }
}
