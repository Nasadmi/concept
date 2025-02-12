import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TokenGuard } from '../token/token.guard';
import { UserService } from './user.service';
import { isUUID } from 'class-validator';
import { UpdateUserDto, UserDto } from 'src/dto/users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(TokenGuard)
  async getById(@Headers('bearer') userid: { id: string }) {
    if (!isUUID(userid.id, '4')) {
      throw new BadRequestException('UUID invalid');
    }

    const user = await this.userService.findUserById(userid.id);

    if (user === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    if (user === null) {
      throw new NotFoundException("User doesn't exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, email, ...rest } = user;

    return rest;
  }

  @Post()
  async createUser(@Body() user: UserDto) {
    const newUser = await this.userService.createUser(user);
    if (typeof newUser === 'string' && newUser === 'ER_DUP_ENTRY') {
      throw new ConflictException('User already exists');
    }

    if (newUser === null) {
      console.error(newUser);
      throw new InternalServerErrorException('Something went wrong');
    }

    throw new HttpException('User created', HttpStatus.CREATED);
  }

  @Post('login')
  async login(@Body() user: Pick<UserDto, 'email' | 'password'>) {
    const token = await this.userService.getToken({
      email: user.email,
      password: user.password,
    });

    if (token === null) {
      throw new NotFoundException("User doesn't exist");
    }

    if (token === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    if (token === false) {
      throw new UnauthorizedException('Password or email incorrect');
    }

    throw new HttpException(`${token}`, HttpStatus.OK);
  }

  @UseGuards(TokenGuard)
  @Delete()
  async deleteUser(@Headers('bearer') bearer: { id: string }) {
    const { id } = bearer;
    if (!isUUID(id, '4')) {
      throw new BadRequestException('Invalid id');
    }
    try {
      await this.userService.deleteUser(id);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @UseGuards(TokenGuard)
  @Put()
  async updateUser(
    @Headers('bearer') bearer: { id: string },
    @Body() user: UpdateUserDto,
  ) {
    const { id } = bearer;
    if (!isUUID(id, '4')) {
      throw new BadRequestException('Invalid id');
    }
    try {
      await this.userService.updateUser(id, user);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
