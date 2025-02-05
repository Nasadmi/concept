import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'markmap' })
export class MarkmapEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.markmaps)
  user?: Pick<UserEntity, 'id'>;

  @Column({ type: 'text', nullable: false })
  code: string;

  @Column({ type: 'decimal', precision: 1, scale: 0, nullable: false })
  public: number;

  @Column({ type: 'bigint', default: 0 })
  stars: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
