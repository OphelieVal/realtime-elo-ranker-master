import { Injectable } from "@nestjs/common";

@Injectable()
export class RankingCacheService {
    private readonly ranking = new Map<string, number>();

    /**
     * Ensure that a player exists in the ranking. If not the player is added with a default rank of 0.
     * @param id 
     */
    ensurePlayer(id: string) : void {
        if (!this.ranking.has(id)) {
            this.ranking.set(id, 1000);
        }
    }

    /**
     * Get a player's rank according to his id
     * @param id 
     * @returns the player's rank if it exists, else 0
     */
    getPlayerRank(id: string): number {
        return this.ranking.get(id) ?? 0;
    }

    /**
     * Update the rank of a player according to his id and new rank
     * @param id 
     * @param rank 
     */
    updatePlayerRank(id: string, rank: number) : void {
        this.ranking.set(id, rank);
    }

    /**
     * Get the global ranking of the players sorted
     * @returns the ranking of all players
     */
    getRanking() : {id : string, rank: number}[] {
        return [...this.ranking.entries()]
        .map(([id, rank]) => ({ id, rank }))
        .sort((a, b) => b.rank - a.rank);
    }

    /**
     * Delete the cache memory. Useful for the testing
     */
    clear(): void {
        this.ranking.clear();
    }
}
