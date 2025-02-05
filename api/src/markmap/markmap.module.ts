import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkmapEntity } from 'src/entities/markmap.entity';
import { MarkmapService } from './markmap.service';
import { MarkmapController } from './markmap.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarkmapEntity])],
  providers: [MarkmapService],
  controllers: [MarkmapController],
})
export class MarkmapModule {}
