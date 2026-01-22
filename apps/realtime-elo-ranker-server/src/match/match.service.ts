import { Injectable, BadRequestException } from '@nestjs/common';
import { Match } from './match.entity';
import { CreateMatchDto } from './createMatch.dto';

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
}