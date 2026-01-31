import { Controller, Get } from "@nestjs/common";
import { RankingService } from "./ranking.service";

@Controller('ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
  ) {}

  /** GET /ranking */
  @Get()
  getRanking(): { id: string; rank: number }[] {
    return this.rankingService.getRanking();
  };
}