import { User } from '../domain/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, is_confirmed as "isConfirmed", confirmation_exp_date as "confirmationCodeExpirationDate",
      confirmation_code as "confirmationCode", recovery_code as "recoveryCode", login,
      recovery_exp_date as "recoveryCodeExpirationDate"
      FROM users
      WHERE id = $1
    `;

    const user = await this.dataSource.query(query, [id]);

    if (user.length === 0) return null;

    return user[0];
  }

  async findByConfirmationCodeOrThrow(code: string): Promise<User> {
    const query = `
    SELECT id, is_confirmed as "isConfirmed", confirmation_exp_date as "confirmationCodeExpirationDate",
    confirmation_code as "confirmationCode"
    FROM users
    WHERE users.confirmation_code = $1;
    `;

    const result = await this.dataSource.query(query, [code]);

    if (result.length === 0) {
      throw new BadRequestException([
        {
          message: 'Incorrect code',
          field: 'code',
        },
      ]);
    }

    return result[0];
  }

  async makeUserConfirmed(userId: string): Promise<void> {
    const query = `
        UPDATE users
        SET is_confirmed = TRUE
        WHERE users.id = $1;
    `;

    await this.dataSource.query(query, [userId]);
  }

  async findByRecoveryCode(code: string): Promise<User> {
    const query = `
        SELECT id, password, recovery_exp_date as "recoveryCodeExpirationDate",
        recovery_code as "recoveryCode"
        FROM users
        WHERE users.recovery_code = $1;
    `;

    const result = await this.dataSource.query(query, [code]);

    if (result.length === 0) {
      throw new BadRequestException([
        {
          message: 'Incorrect code',
          field: 'recoveryCode',
        },
      ]);
    }

    return result[0];
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    const query = `
        UPDATE users
        SET password = '${passwordHash}'
        WHERE users.id = $1;
    `;

    await this.dataSource.query(query, [userId]);
  }

  async findByLoginOrEmail(login: string, email: string): Promise<User | null> {
    const query = `
      SELECT *
      FROM users
      WHERE login = $1 OR email = $2
    `;

    const user = await this.dataSource.query(query, [login, email]);

    if (user.length === 0) return null;

    return user[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, is_confirmed as "isConfirmed", confirmation_exp_date as "confirmationCodeExpirationDate",
      confirmation_code as "confirmationCode", recovery_code as "recoveryCode",
      recovery_exp_date as "recoveryCodeExpirationDate"
      FROM users
      WHERE email = $1
    `;

    const user = await this.dataSource.query(query, [email]);

    if (user.length === 0) return null;

    return user[0];
  }

  async updateConfirmationCode(
    userId: string,
    newCode: string,
    newDate: string,
  ) {
    const query = `
        UPDATE users
        SET confirmation_code = '${newCode}', confirmation_exp_date = '${newDate}'
        WHERE users.id = $1;
    `;

    await this.dataSource.query(query, [userId]);
  }

  async updateRecoveryCode(userId: string, newCode: string, newDate: string) {
    const query = `
        UPDATE users
        SET recovery_code = '${newCode}', recovery_exp_date = '${newDate}'
        WHERE users.id = $1;
    `;

    await this.dataSource.query(query, [userId]);
  }

  async create(values: CreateUserDto): Promise<string> {
    const {
      login,
      password,
      email,
      isConfirmed,
      confirmationCode,
      recoveryCode,
      recoveryCodeExpirationDate,
      confirmationCodeExpirationDate,
    } = values;

    const optionalValues = [];
    const optionalColumns = [];

    if (confirmationCode) {
      optionalColumns.push('confirmation_code');
      optionalValues.push(`'${confirmationCode}'`);
    }

    if (confirmationCodeExpirationDate) {
      optionalColumns.push('confirmation_exp_date');
      optionalValues.push(`'${confirmationCodeExpirationDate}'`);
    }

    if (recoveryCode) {
      optionalColumns.push('recovery_code');
      optionalValues.push(`'${recoveryCode}'`);
    }

    if (recoveryCodeExpirationDate) {
      optionalColumns.push('recovery_exp_date');
      optionalValues.push(`'${recoveryCodeExpirationDate}'`);
    }

    const query = `
      INSERT INTO users(login, password, email, is_confirmed ${optionalColumns.length > 0 ? ',' + optionalColumns.join(',') : ''})
      values('${login}', '${password}', '${email}', ${isConfirmed} ${optionalValues.length > 0 ? ',' + optionalValues.join(',') : ''})
      RETURNING id;
    `;

    const result = await this.dataSource.query(query);

    return result[0].id;
  }

  async getByIdOrThrow(id: string): Promise<User> {
    const query = `
    SELECT *
    FROM users
    WHERE users.id = $1;
    `;

    const result: User[] = await this.dataSource.query(query, [id]);

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
