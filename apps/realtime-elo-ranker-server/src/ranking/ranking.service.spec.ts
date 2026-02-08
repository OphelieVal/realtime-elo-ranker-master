import { RankingCacheService } from './ranking-cache.service';

describe('RankingCacheService', () => {
  let service: RankingCacheService;

  beforeEach(() => {
    service = new RankingCacheService();
  });

  afterEach(() => {
    service.clear();
  });

  describe('ensurePlayer', () => {
    it('should add player with default rank if not exists', () => {
      service.ensurePlayer('Alice');
      expect(service.getPlayerRank('Alice')).toBe(1000);
    });

    it('should not override existing rank', () => {
      service.ensurePlayer('Alice');
      service.updatePlayerRank('Alice', 1200);

      service.ensurePlayer('Alice');
      expect(service.getPlayerRank('Alice')).toBe(1200);
    });
  });

  describe('getPlayerRank', () => {
    it('should return 0 for unknown player', () => {
      expect(service.getPlayerRank('Unknown')).toBe(0);
    });

    it('should return rank for existing player', () => {
      service.updatePlayerRank('Bob', 900);
      expect(service.getPlayerRank('Bob')).toBe(900);
    });
  });

  describe('updatePlayerRank', () => {
    it('should update the player rank', () => {
      service.updatePlayerRank('Alice', 1500);
      expect(service.getPlayerRank('Alice')).toBe(1500);
    });
  });

  describe('getRanking', () => {
    it('should return players sorted by rank descending', () => {
      service.updatePlayerRank('Alice', 1200);
      service.updatePlayerRank('Bob', 1500);
      service.updatePlayerRank('Charlie', 1000);

      expect(service.getRanking()).toEqual([
        { id: 'Bob', rank: 1500 },
        { id: 'Alice', rank: 1200 },
        { id: 'Charlie', rank: 1000 },
      ]);
    });
  });

  describe('clear', () => {
    it('should clear the ranking cache', () => {
      service.updatePlayerRank('Alice', 1000);
      service.clear();
      expect(service.getRanking()).toEqual([]);
    });
  });
});
