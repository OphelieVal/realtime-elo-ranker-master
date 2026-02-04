import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { RankingCacheService } from 'src/ranking/ranking-cache.service';
import { RankingModule } from 'src/ranking/ranking.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player]),
    RankingModule
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}