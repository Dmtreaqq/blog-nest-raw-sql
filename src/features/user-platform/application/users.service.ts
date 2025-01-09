import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { CryptoService } from './crypto.service';
import { CreateUserInputDto } from '../api/input-dto/create-user.input-dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async createUser(dto: CreateUserInputDto): Promise<string> {
    const isUserWithSameLoginOrEmailExist =
      await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);
    if (isUserWithSameLoginOrEmailExist) {
      throw new BadRequestException([
        {
          message: 'User already exists',
          field: 'email',
        },
      ]);
    }

    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );

    const values: CreateUserDto = {
      email: dto.email,
      login: dto.login,
      password: passwordHash,
      confirmationCode: '',
      recoveryCode: '',
      isConfirmed: true,
    };

    return this.usersRepository.create(values);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.getByIdOrThrow(id);

    await this.usersRepository.delete(user.id);
  }
}
