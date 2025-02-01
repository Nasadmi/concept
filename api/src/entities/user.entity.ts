import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { MarkmapEntity } from './markmap.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 500, nullable: false, unique: true })
  email: string;

  @OneToMany(() => MarkmapEntity, (markmap) => markmap.user)
  markmaps: MarkmapEntity[];

  @Column({ type: 'varchar', length: 500, nullable: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;
}
