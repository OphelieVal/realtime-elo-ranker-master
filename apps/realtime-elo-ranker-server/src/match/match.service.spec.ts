import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from 'src/player/player.service';
import { RankingCacheService } from 'src/ranking/ranking-cache.service';
import { rankingEmitter } from 'src/lib/rankingEmitter';

jest.mock('src/lib/rankingEmitter', () => ({
  rankingEmitter: {
    emit: jest.fn(),
  },
}));

describe('MatchService', () => {
  let service: MatchService;
  let playerService: jest.Mocked<PlayerService>;
  let rankingCache: jest.Mocked<RankingCacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: PlayerService,
          useValue: {
            ensurePlayer: jest.fn(),
            updateRank: jest.fn(),
          },
        },
        {
          provide: RankingCacheService,
          useValue: {
            getPlayerRank: jest.fn(),
            updatePlayerRank: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MatchService);
    playerService = module.get(PlayerService);
    rankingCache = module.get(RankingCacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────

  describe('playMatch', () => {

    describe('when there is a winner', () => {
      it('should update ranks, cache, database and emit events', async () => {
        const dto = { winner: 'Alice', loser: 'Bob', draw: false };

        playerService.ensurePlayer
          .mockResolvedValueOnce({ id: 'Alice' } as any)
          .mockResolvedValueOnce({ id: 'Bob' } as any);

        rankingCache.getPlayerRank
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(2);

        const result = await service.playMatch(dto as any);

        expect(rankingCache.updatePlayerRank).toHaveBeenCalledWith('Alice', 4);
        expect(rankingCache.updatePlayerRank).toHaveBeenCalledWith('Bob', 1);

        expect(playerService.updateRank).toHaveBeenCalledWith('Alice', 4);
        expect(playerService.updateRank).toHaveBeenCalledWith('Bob', 1);

        expect(rankingEmitter.emit).toHaveBeenCalledTimes(2);

        expect(result).toEqual({
          winner: { id: 'Alice', rank: 4 },
          loser: { id: 'Bob', rank: 1 },
        });
      });
    });

    describe('when the match is a draw', () => {
      it('should increment both players ranks', async () => {
        const dto = { winner: 'Alice', loser: 'Bob', draw: true };

        playerService.ensurePlayer
          .mockResolvedValueOnce({ id: 'Alice' } as any)
          .mockResolvedValueOnce({ id: 'Bob' } as any);

        rankingCache.getPlayerRank
          .mockReturnValueOnce(1)
          .mockReturnValueOnce(5);

        const result = await service.playMatch(dto as any);

        expect(rankingCache.updatePlayerRank).toHaveBeenCalledWith('Alice', 2);
        expect(rankingCache.updatePlayerRank).toHaveBeenCalledWith('Bob', 6);

        expect(result).toEqual({
          winner: { id: 'Alice', rank: 2 },
          loser: { id: 'Bob', rank: 6 },
        });
      });
    });

    describe('edge cases', () => {
      it('should never set a negative rank for the loser', async () => {
        const dto = { winner: 'Alice', loser: 'Bob', draw: false };

        playerService.ensurePlayer
          .mockResolvedValueOnce({ id: 'Alice' } as any)
          .mockResolvedValueOnce({ id: 'Bob' } as any);

        rankingCache.getPlayerRank
          .mockReturnValueOnce(10)
          .mockReturnValueOnce(0);

        const result = await service.playMatch(dto as any);

        expect(result.loser.rank).toBe(0);
        expect(rankingCache.updatePlayerRank).toHaveBeenCalledWith('Bob', 0);
      });
    });

  });
});
