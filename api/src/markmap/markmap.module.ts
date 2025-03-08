import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkmapEntity } from 'src/entities/markmap.entity';
import { MarkmapService } from './markmap.service';
import { MarkmapController } from './markmap.controller';
import { StarsEntity } from 'src/entities/stars.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarkmapEntity, StarsEntity])],
  providers: [MarkmapService],
  controllers: [MarkmapController],
})
export class MarkmapModule {}
