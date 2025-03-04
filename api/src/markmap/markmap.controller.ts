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
} from '@nestjs/common';
import { MarkmapService } from './markmap.service';
import { MarkmapDto, UpdateMarkmapDto } from 'src/dto/markmaps.dto';
import { TokenGuard } from 'src/token/token.guard';
import { MarkmapInterceptor } from './markmap.interceptor';

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

    return newMarkmap;
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
