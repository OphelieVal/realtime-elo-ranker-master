import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PlayerModule } from 'src/player/player.module';
import { RankingModule } from 'src/ranking/ranking.module';

@Module({
  imports : [PlayerModule, RankingModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}