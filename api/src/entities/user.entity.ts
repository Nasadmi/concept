import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 500, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  password: string;
}
