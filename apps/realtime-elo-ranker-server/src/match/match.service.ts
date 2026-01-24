import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdateMatchDto } from './dto/updateMatch.dto';

@Injectable()
export class MatchService {
    private matchs : Match[] = [];
    private idCounter : number = 1;

    /**
     * Creates a new match with the given data.
     * @param match The data for the match to be created.
     * @returns The created Match object.
     * @throws BadRequestException if the input data is invalid.
     */
    createMatch(match : CreateMatchDto): Match {
        if (match.opponent1 === match.opponent2) {
            throw new Error("An opponent cannot play against themselves.");
        }
        else if (!match || typeof match.opponent1 !== 'string' || typeof match.opponent2 !== 'string') {
            throw new BadRequestException('Invalid opponent data. Expected { opponent1: string, opponent2: string }');
        }
        const newMatch: Match = {
            id: this.idCounter++,
            opponent1: match.opponent1,
            opponent2: match.opponent2,
            score1: 0,
            score2: 0
        };
        this.matchs.push(newMatch);
        return newMatch;
    }

    /**
     * Retrieves all matches.
     * @returns An array of all Match objects.
     */
    getAllMatches(): Match[] {
        return this.matchs;
    } 

    /**
     * Retrieves a match by its ID.
     * @param id The ID of the match to retrieve.
     * @returns The Match object with the specified ID.
     * @throws BadRequestException if no match with the given ID is found.
     */
    getMatchById(id: number): Match {
        const match = this.matchs.find(match => match.id === id);
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
    updateMatch(id: number, updateData: UpdateMatchDto): Match {
        const match = this.getMatchById(id);
        if (!match) {
            throw new NotFoundException(`Match with id ${id} not found.`);
        }
        Object.assign(match, updateData);
        return match;
    }

    /**
     * Deletes a match with the given ID.
     * @param id
     * @throws NotFoundException if no match with the given ID is found.
     */
    deleteMatch(id: number): void {
        const index = this.matchs.findIndex(match => match.id === id);
        if (index === -1) {
            throw new NotFoundException(`Match with id ${id} not found.`);
        }
        this.matchs.splice(index, 1);
    }
}