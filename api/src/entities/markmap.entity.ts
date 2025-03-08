import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { StarsEntity } from './stars.entity';

@Entity({ name: 'markmap' })
export class MarkmapEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.markmaps)
  user: UserEntity;

  @Column({ type: 'text', nullable: false })
  code: string;

  @Column({ type: 'decimal', precision: 1, scale: 0, nullable: false })
  public: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => StarsEntity, (stars) => stars.markmap, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  stars: StarsEntity[];
}
