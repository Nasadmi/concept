import { Entity, Unique, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';
import { MarkmapEntity } from './markmap.entity';

@Entity('stars')
@Unique(['user', 'markmap'])
export class StarsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.stars)
  user: UserEntity;

  @ManyToOne(() => MarkmapEntity, (user) => user.stars)
  markmap: MarkmapEntity;
}
