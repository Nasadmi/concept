import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Headers,
  UseGuards,
  UseInterceptors,
  Param,
  Get,
  NotFoundException,
  Put,
  Delete,
  HttpStatus,
  Query,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { MarkmapService } from './markmap.service';
import { MarkmapDto, UpdateMarkmapDto } from 'src/dto/markmaps.dto';
import { TokenGuard } from 'src/token/token.guard';
import { MarkmapInterceptor } from './markmap.interceptor';
import { UserEntity } from 'src/entities/user.entity';
import { MarkmapEntity } from 'src/entities/markmap.entity';

@Controller('markmap')
export class MarkmapController {
  constructor(private readonly markmapService: MarkmapService) {}

  @Post()
  @UseGuards(TokenGuard)
  @UseInterceptors(MarkmapInterceptor)
  async createMarkmap(@Body() markmap: MarkmapDto) {
    const newMarkmap = await this.markmapService.createMarkmap(markmap);

    if (newMarkmap === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return { ...newMarkmap, stars: 0 };
  }

  @Get('query')
  async searchMarkmapByName(
    @Query('order_stars') orderStars: 'ASC' | 'DESC',
    @Query('order_date') orderDate: 'ASC' | 'DESC',
    @Query('name') name?: string,
    @Query('username') username?: string,
  ) {
    const markmaps = await this.markmapService.findMarkmap({
      ...(name && {
        name,
      }),
      orderStars,
      orderDate,
      ...(username && {
        username,
      }),
    });

    if (markmaps === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    if (markmaps === null) {
      throw new NotFoundException('This markmap does not exist');
    }

    return markmaps;
  }

  @Get('user')
  @UseGuards(TokenGuard)
  async getMarkmapFromUser(@Headers('bearer') bearer: { id: string }) {
    const markmaps = await this.markmapService.getMarkmapOfUser(bearer.id);
    if (markmaps === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    if (markmaps === null) {
      throw new NotFoundException('This user does not have markmaps');
    }

    return markmaps;
  }

  @Get('fav')
  @UseGuards(TokenGuard)
  async getStarredMarkmapFromUser(@Headers('bearer') bearer: { id: string }) {
    const markmap = await this.markmapService.getStarredMarkmapOfUser(
      bearer.id,
    );

    if (markmap === null) throw new NotFoundException('No starred markmaps');
    if (markmap === 0)
      throw new InternalServerErrorException('Something went wrong');
    return markmap;
  }

  @Get('view/:id')
  @UseGuards(TokenGuard)
  async getViewMarkmap(
    @Param('id') id: string,
    @Headers('bearer') bearer: { id: string },
  ) {
    try {
      const markmaps = await this.markmapService.viewMarkmap(id, bearer.id);
      if (markmaps === null) throw new NotFoundException('Markmap not found');
      if (markmaps === 0)
        throw new InternalServerErrorException('Something went wrong');
      return markmaps;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Post('star/:id')
  @UseGuards(TokenGuard)
  async addStar(
    @Headers('bearer') user: Pick<UserEntity, 'id'>,
    @Param('id') markmap: Pick<MarkmapEntity, 'id'>,
  ) {
    try {
      const saved = await this.markmapService.addStar({ user, markmap });
      if (saved === 0)
        throw new ConflictException('This user already starred this markmap');
      if (saved === false) throw new BadRequestException('Some data fault');
      return {
        statusCode: 200,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Delete('star/:id')
  @UseGuards(TokenGuard)
  async deleteStar(
    @Headers('bearer') user: Pick<UserEntity, 'id'>,
    @Param('id') markmap: Pick<MarkmapEntity, 'id'>,
  ) {
    try {
      const saved = await this.markmapService.removeStar({ user, markmap });
      if (saved === 0)
        throw new ConflictException('This user already starred this markmap');
      if (saved === false) throw new BadRequestException('Some data fault');
      return {
        statusCode: 200,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Get('code/:id')
  @UseGuards(TokenGuard)
  async getCodeOfMarkmap(
    @Headers('bearer') bearer: { id: string },
    @Param('id') id: string,
  ) {
    try {
      const mkm = await this.markmapService.editMarkmap(bearer.id, id);

      if (!mkm) {
        throw new NotFoundException('Markmap not found');
      }

      const { name, code, public: pub, id: mkmId } = mkm;

      return {
        name,
        code,
        pub,
        id: mkmId,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Put(':id')
  @UseGuards(TokenGuard)
  async updateMarkmaps(
    @Headers('bearer') bearer: { id: string },
    @Param('id') id: string,
    @Body() uMarkmap: UpdateMarkmapDto,
  ) {
    const newMarkmap = await this.markmapService.updateMarkmap(
      bearer.id,
      id,
      uMarkmap,
    );

    if (newMarkmap === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Markmap updated',
    };
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  async removeMarkmap(
    @Headers('bearer') bearer: { id: string },
    @Param('id') id: string,
  ) {
    try {
      await this.markmapService.deleteMarkmap(id, bearer.id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Markmap deleted',
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
