import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { RankingCacheService } from './ranking-cache.service';

@Module({
  controllers: [RankingController],
  providers: [RankingService, RankingCacheService],
  exports: [RankingCacheService]
})
export class RankingModule {}