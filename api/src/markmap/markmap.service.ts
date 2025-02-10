import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarkmapEntity } from 'src/entities/markmap.entity';
import { MarkmapDto, UpdateMarkmapDto } from 'src/dto/markmaps.dto';

@Injectable()
export class MarkmapService {
  constructor(
    @InjectRepository(MarkmapEntity)
    private readonly markmapRepository: Repository<MarkmapEntity>,
  ) {}

  async createMarkmap(markmap: MarkmapDto) {
    try {
      return await this.markmapRepository.save(markmap);
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async findMarkmap({
    name,
    order,
    username,
  }: {
    name: string;
    order: 'stars' | 'date';
    username?: string;
  }): Promise<MarkmapEntity[] | null | 0> {
    try {
      const founded = await this.markmapRepository.find({
        where: {
          name,
          public: 1,
          ...(username && {
            user: {
              username,
            },
          }),
        },
        relations: { user: true },
        order: {
          ...(order === 'date'
            ? {
                created_at: 'ASC',
              }
            : {
                stars: 'ASC',
              }),
        },
        take: 25,
      });
      if (founded.length === 0) {
        return null;
      }
      return founded;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async getMarkmapOfUser(user: string) {
    try {
      const founded = await this.markmapRepository.find({
        where: { user: { id: user } },
        relations: { user: true },
      });

      if (founded.length === 0) {
        return null;
      }

      return founded;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async updateMarkmap(
    user: string,
    markmapId: string,
    markmap: UpdateMarkmapDto,
  ) {
    try {
      return await this.markmapRepository.update(
        { id: markmapId, user: { id: user } },
        markmap,
      );
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async deleteMarkmap(markmapId: string, userId: string) {
    return await this.markmapRepository.delete({
      id: markmapId,
      user: { id: userId },
    });
  }
}
