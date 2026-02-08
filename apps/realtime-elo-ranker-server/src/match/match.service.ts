import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { CreateMatchDto } from './dto/createMatch.dto';
import { RankingCacheService } from 'src/ranking/ranking-cache.service';
import { rankingEmitter } from 'src/lib/rankingEmitter';
import { RankingEventType } from '../../../realtime-elo-ranker-client/src/services/ranking/models/ranking-event';

@Injectable()
export class MatchService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly rankingCache : RankingCacheService
  ) {}

  /**
   * Simulate a match playing and publish the update the ranking and database accordingly
   * @param dto 
   * @returns the changes on the players following the match
   */
  async playMatch(dto: CreateMatchDto) {
    const { winner, loser, draw } = dto;

    // Assure que les joueurs existent et sont dans le cache
    const winnerPlayer = await this.playerService.ensurePlayer(winner);
    const loserPlayer = await this.playerService.ensurePlayer(loser);

    let winnerRank = this.rankingCache.getPlayerRank(winnerPlayer.id);
    let loserRank = this.rankingCache.getPlayerRank(loserPlayer.id);

    // Mise à jour des ranks
    if (!draw) {
      winnerRank++;
      loserRank = Math.max(0, loserRank - 1); // jamais négatif
    } else {
      winnerRank++;
      loserRank++;
    }

    // Synchronisation cache
    this.rankingCache.updatePlayerRank(winnerPlayer.id, winnerRank);
    this.rankingCache.updatePlayerRank(loserPlayer.id, loserRank);

    // Synchronisation base
    await this.playerService.updateRank(winnerPlayer.id, winnerRank);
    await this.playerService.updateRank(loserPlayer.id, loserRank);

    rankingEmitter.emit("ranking", {
      type: RankingEventType.RankingUpdate,
      player: {
        id: winnerPlayer.id,
        rank: winnerRank,
      },
    });

    rankingEmitter.emit("ranking", {
      type: RankingEventType.RankingUpdate,
      player: {
        id: loserPlayer.id,
        rank: loserRank,
      }, 
    })

    return {
      winner: { id: winnerPlayer.id, rank: winnerRank },
      loser: { id: loserPlayer.id, rank: loserRank },
    };
  }
}
