import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { MarkmapEntity } from 'src/entities/markmap.entity';
import { MarkmapDto, UpdateMarkmapDto } from 'src/dto/markmaps.dto';
import { StarsEntity } from 'src/entities/stars.entity';
import { StarsDTO } from 'src/dto/stars.dto';

@Injectable()
export class MarkmapService {
  constructor(
    @InjectRepository(MarkmapEntity)
    private readonly markmapRepository: Repository<MarkmapEntity>,
    @InjectRepository(StarsEntity)
    private readonly starsRepository: Repository<StarsEntity>,
  ) {}

  async createMarkmap(markmap: MarkmapDto) {
    try {
      const saved = await this.markmapRepository.save(markmap);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, code, ...rest } = saved;
      return rest;
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
  }): Promise<Partial<MarkmapDto[]> | null | 0> {
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
          stars: true,
        },
        order: {
          created_at: orderDate,
        },
        take: 25,
        select: {
          code: false,
          public: false,
          user: {
            username: true,
          },
        },
      });
      if (founded.length === 0) {
        return null;
      }

      console.log(founded);

      const result = founded
        .map((mkm) => ({
          ...mkm,
          stars: mkm.stars.length,
        }))
        .sort((a, b) => {
          if (orderStars === 'DESC') {
            return a.stars - b.stars;
          } else {
            return b.stars - a.stars;
          }
        });

      return result;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async viewMarkmap(id: string, user: string) {
    try {
      const starred = await this.starsRepository.findOne({
        where: {
          markmap: { id },
          user: { id: user },
        },
      });
      const markmap = await this.markmapRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          user: true,
          stars: true,
        },
        select: {
          public: false,
          user: {
            username: true,
          },
        },
      });
      if (!markmap) {
        return null;
      }
      return {
        ...markmap,
        stars: markmap.stars.length,
        starred: starred ? true : false,
      };
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async addStar(star: StarsDTO) {
    try {
      await this.starsRepository.save(star);
      return true;
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.errno === 1062) {
        return 0;
      }
      return false;
    }
  }

  async removeStar(star: StarsDTO) {
    try {
      await this.starsRepository.delete(star);
      return true;
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.errno === 1062) {
        return 0;
      }
      return false;
    }
  }

  async getMarkmapOfUser(user: string) {
    try {
      const founded = await this.markmapRepository.find({
        where: { user: { id: user } },
        select: ['id', 'name', 'public', 'created_at', 'updated_at'],
        relations: { user: false, stars: true },
      });

      if (founded.length === 0) {
        return null;
      }

      const result = founded.map((mkm) => ({
        ...mkm,
        stars: mkm.stars.length,
      }));

      return result;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async getStarredMarkmapOfUser(user: string) {
    try {
      const founded = await this.markmapRepository.find({
        relations: ['stars', 'user'],
        where: {
          stars: {
            user: {
              id: user,
            },
          },
        },
        select: {
          user: {
            username: true,
          },
        },
      });
      console.log(founded);

      if (founded.length === 0) return null;
      const result = founded
        .map((mkm) => ({
          ...mkm,
          stars: mkm.stars.length,
        }))
        .sort((a, b) => {
          return b.stars - a.stars;
        });
      return result;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  async editMarkmap(user: string, id: string) {
    try {
      const mkm = await this.markmapRepository.findOneBy({
        user: {
          id: user,
        },
        id,
      });
      return mkm;
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
    console.log(markmapId, userId);
    const deleted = await this.markmapRepository.delete({
      id: markmapId,
      user: { id: userId },
    });

    console.log(deleted);
  }
}
