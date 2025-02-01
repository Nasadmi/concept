import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto, UserDto } from 'src/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async findUserById(id: string) {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async createUser(
    user: UserDto,
  ): Promise<string | null | (UserDto & UserEntity)> {
    try {
      user.password = await hash(user.password, 8);
      return await this.userRepository.save(user);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return err.code ? err.code : null;
    }
  }

  async getToken({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.findUserByEmail(email);

      if (user === null) {
        return null;
      }

      if (user === 0) {
        throw new Error('');
      }

      if (!(await compare(password, user.password))) {
        return false;
      }

      return this.jwtService.sign({ id: user.id });
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.userRepository.delete(id);
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async updateUser(id: string, user: UpdateUserDto) {
    try {
      return await this.userRepository.update(id, user);
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}
