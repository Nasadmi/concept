import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { MarkmapService } from './markmap.service';
import { MarkmapDto } from 'src/dto/markmaps.dto';
import { TokenGuard } from 'src/token/token.guard';

@Controller('markmap')
@UseGuards(TokenGuard)
export class MarkmapController {
  constructor(private readonly markmapService: MarkmapService) {}

  @Post()
  async createMarkmap(
    @Headers() bearer: { id: string },
    @Body() markmap: MarkmapDto,
  ) {
    markmap.user.id = bearer.id;
    const newMarkmap = await this.markmapService.createMarkmap(markmap);

    if (newMarkmap === 0) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return newMarkmap;
  }
}
