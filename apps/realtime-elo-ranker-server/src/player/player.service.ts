import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ) {}

    /**
     * Creates a new match with the given data.
     * @param match The data for the match to be created.
     * @returns The created Player object.
     */
    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const newPlayer = this.playerRepository.create(createPlayerDto);
        return this.playerRepository.save(newPlayer);
    }

    /**
     * Retrieves all matches.
     * @returns An array of all Player objects.
     */
    async findAllPlayers(): Promise<Player[]> {
        return await this.playerRepository.find();
    } 

    /**
     * Retrieves a player by its ID.
     * @param id The ID of the match to retrieve.
     * @returns The Match object with the specified ID.
     * @throws NotFoundException if no match with the given ID is found.
     */
    async findPlayerById(id: string): Promise<Player> {
        const player = await this.playerRepository.findOneBy({ id });
        if (!player) {
            throw new NotFoundException(`Player with id ${id} not found.`);
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