import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';
import { RankingCacheService } from 'src/ranking/ranking-cache.service';

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        private readonly rankingCache : RankingCacheService,
    ) {}

    /**
     * Creates a new player with the given data.
     * @param match The data for the player to be created.
     * @returns The created Player object.
     */
    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const newPlayer = this.playerRepository.create({...createPlayerDto, rank: 1000});
        await this.playerRepository.save(newPlayer);
        this.rankingCache.ensurePlayer(newPlayer.id);
        return newPlayer;
    }

    /**
     * Retrieves all players.
     * @returns An array of all Player objects.
     */
    async findAllPlayers(): Promise<Player[]> {
        return await this.playerRepository.find();
    } 

    /**
     * Retrieves a player by its ID.
     * @param id The ID of the player to retrieve.
     * @returns The Player object with the specified ID.
     * @throws NotFoundException if no player with the given ID is found.
     */
    async findPlayerById(id: string): Promise<Player> {
        const player = await this.playerRepository.findOneBy({ id });
        if (!player) {
            throw new NotFoundException(`Player with id ${id} not found.`);
        }
        return player;
    }

    /**
     * Ensure that a player exists both in the database and cache
     * @param playerId 
     * @returns the player found or created
     */
    async ensurePlayer(playerId: string) : Promise<Player> {
        let player = await this.playerRepository.findOne({ where: { id: playerId } });
        if (!player) {
            player = await this.createPlayer({id: playerId} as CreatePlayerDto);
        }
        else {
            this.rankingCache.ensurePlayer(player.id);
        }
    
        return player;
    }

    /**
     * Updates a player with the given ID using the provided update data.
     * @param id 
     * @param updateData 
     * @returns The updated Player object.
     * @throws NotFoundException if no player with the given ID is found.
     */
    async updatePlayer(id: string, updateData: UpdatePlayerDto): Promise<Player> {
        const player = await this.findPlayerById(id);
        if (!player) {
            throw new NotFoundException(`Player with id ${id} not found.`);
        }
        Object.assign(player, updateData);
        return this.playerRepository.save(player);
    }
    
    /**
     * Update the rank of a player given his id and new rank
     * @param playerId 
     * @param rank 
     */
    async updateRank(playerId: string, rank: number): Promise<void> {
        await this.playerRepository.update(
            { id: playerId },
            { rank },
        );
    };


    /**
     * Deletes a player with the given ID.
     * @param id
     * @throws NotFoundException if no player with the given ID is found.
     */
    async deletePlayer(id: string): Promise<void> {
        const result = await this.playerRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Player with id ${id} not found.`);
        }
    }
}