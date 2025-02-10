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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MarkmapService } from './markmap.service';
import { MarkmapDto, UpdateMarkmapDto } from 'src/dto/markmaps.dto';
import { TokenGuard } from 'src/token/token.guard';
import { MarkmapInterceptor } from './markmap.interceptor';
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

    return newMarkmap;
  }

  @Get('query')
  async searchMarkmapByName(
    @Query('name') name: string,
    @Query('order') order: 'stars' | 'date',
    @Query('username') username?: string,
  ) {
    let markmaps: MarkmapEntity[] | null | 0;

    if (!username) {
      markmaps = await this.markmapService.findMarkmap({ name, order });
    } else {
      markmaps = await this.markmapService.findMarkmap({
        name,
        order,
        username,
      });
    }

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
    return newMarkmap;
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.OK)
  async removeMarkmap(
    @Headers('bearer') bearer: { id: string },
    @Param('id') id: string,
  ) {
    try {
      await this.markmapService.deleteMarkmap(bearer.id, id);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
