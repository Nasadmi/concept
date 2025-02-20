import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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
    orderStars,
    orderDate,
    username,
  }: {
    name?: string;
    orderStars: 'ASC' | 'DESC';
    orderDate: 'ASC' | 'DESC';
    username?: string;
  }): Promise<MarkmapEntity[] | null | 0> {
    try {
      const founded = await this.markmapRepository.find({
        where: {
          ...(name && {
            name: Like(`%${name}%`),
          }),
          public: 1,
          ...(username && {
            user: {
              username: Like(`%${username}%`),
            },
          }),
        },
        relations: {
          user: true,
        },
        order: {
          stars: orderStars,
          created_at: orderDate,
        },
        take: 25,
        select: {
          created_at: true,
          name: true,
          stars: true,
          updated_at: true,
          id: true,
          user: {
            username: true,
          },
        },
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
        select: ['id', 'name', 'public', 'stars', 'created_at', 'updated_at'],
        relations: { user: false },
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
