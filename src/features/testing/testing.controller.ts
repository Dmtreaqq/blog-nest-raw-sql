import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.dataSource.query(`
      DELETE FROM blogs;

      DELETE FROM users_device_sessions;
      DELETE FROM users;
    `);
  }
}
