import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdateMatchDto } from './dto/updateMatch.dto';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    /**
     * Creates a new match with the given data.
     * @param match The data for the match to be created.
     * @returns The created Match object.
     */
    async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
        const newMatch = this.matchRepository.create(createMatchDto);
        return this.matchRepository.save(newMatch);
    }

    /**
     * Retrieves all matches.
     * @returns An array of all Match objects.
     */
    async findAllMatches(): Promise<Match[]> {
        return await this.matchRepository.find();
    } 

    /**
     * Retrieves a match by its ID.
     * @param id The ID of the match to retrieve.
     * @returns The Match object with the specified ID.
     * @throws NotFoundException if no match with the given ID is found.
     */
    async findMatchById(id: string): Promise<Match> {
        const match = await this.matchRepository.findOneBy({ id });
        if (!match) {
            throw new NotFoundException(`Match with id ${id} not found.`);
        }
        return match;
    }

    /**
     * Updates a match with the given ID using the provided update data.
     * @param id 
     * @param updateData 
     * @returns The updated Match object.
     * @throws NotFoundException if no match with the given ID is found.
     */
    async updateMatch(id: string, updateData: UpdateMatchDto): Promise<Match> {
        const match = await this.findMatchById(id);
        if (!match) {
            throw new NotFoundException(`Match with id ${id} not found.`);
        }
        Object.assign(match, updateData);
        return this.matchRepository.save(match);
    }

    /**
     * Deletes a match with the given ID.
     * @param id
     * @throws NotFoundException if no match with the given ID is found.
     */
    async deleteMatch(id: string): Promise<void> {
        const result = await this.matchRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Match with id ${id} not found.`);
        }
    }
}