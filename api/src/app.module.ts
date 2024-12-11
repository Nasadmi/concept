import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { MarkmapEntity } from './entities/markmap.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'concept',
      entities: [UserEntity, MarkmapEntity],
      synchronize: process.env.NODE_ENV === 'dev',
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
