import { Controller, Get, ParseIntPipe, Param, Post, Body, ValidationPipe, Put, Delete } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdateMatchDto } from './dto/updateMatch.dto';

@Controller('matchs')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}
    @Get()
    getAllMatchs(): Match[] {
        return this.matchService.getAllMatches();
    }

    @Get(':id')
    getMatchById(@Param('id', new ParseIntPipe()) id: number): Match {
        return this.matchService.getMatchById(id);
    }

    @Post()
    createMatch(@Body(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true, transform: true})) body: CreateMatchDto): Match {
        return this.matchService.createMatch(body);
    }

    @Put(':id')
    updateMatch(@Param('id', new ParseIntPipe()) id: number, @Body() body:UpdateMatchDto): Match {
        // Logic to update a match by id
        return this.matchService.updateMatch(id, body);
    }

    @Delete(':id')
    delete(@Param('id', new ParseIntPipe()) id: number) {
        // Logic to delete a match by id
        this.matchService.deleteMatch(id);
    }
}