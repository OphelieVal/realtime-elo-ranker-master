import { Injectable } from "@nestjs/common";
import { RankingCacheService } from "./ranking-cache.service";
import { todo } from "node:test";

@Injectable()
export class RankingService {
  constructor(
    private readonly rankingCache: RankingCacheService,
  ) {}

  /** Retourne le classement global */
  getRanking() : { id: string; rank: number }[] {
    return this.rankingCache.getRanking();
  };
}