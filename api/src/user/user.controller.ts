import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Headers,
  InternalServerErrorException,
  NotFoundException,
  Param,
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

  @Get('get/:id')
  async getById(@Param('id') userid: string) {
    if (!isUUID(userid, '4')) {
      throw new BadRequestException('UUID invalid');
    }

    const user = await this.userService.findUserById(userid);

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
  }

  @Get('login')
  async login(@Body() user: { email: string; password: string }) {
    console.log('token');
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

    return { tk: token };
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
