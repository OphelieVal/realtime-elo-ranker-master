import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdatePlayerDto } from '../player/dto/updatePlayer.dto';
import { RankingCacheService } from 'src/ranking/ranking-cache.service';

@Injectable()
export class MatchService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly updatePlayerDto : UpdatePlayerDto,
    private readonly rankingCache : RankingCacheService
  ) {}


  async playMatch(dto: CreateMatchDto) {
    const { winner, loser, draw } = dto;

    this.rankingCache.ensurePlayer(winner);
    this.rankingCache.ensurePlayer(loser);

    let winnerRank = this.rankingCache.getPlayerRank(winner);
    let loserRank = this.rankingCache.getPlayerRank(loser);

    if (!draw) {
      winnerRank++;
      loserRank--;
    }

    // Sync cache
    this.rankingCache.updatePlayerRank(winner, winnerRank);
    this.rankingCache.updatePlayerRank(loser, loserRank);

    // sync DB
    await this.playerService.updateRank(winner, winnerRank);
    await this.playerService.updateRank(loser, loserRank);

    return {
      winner: { id: winner, rank: winnerRank },
      loser: { id: loser, rank: loserRank },
    };
  }
}
