import { Controller, Get, ParseIntPipe, Param, Post, Body, ValidationPipe, Put, Delete, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { UpdateMatchDto } from './dto/updateMatch.dto';

@Controller('matchs')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}
    @Get()
    findAllMatchs(): Promise<Match[]> {
        return this.matchService.findAllMatches();
    }

    @Get('query')
    findAllQuery(@Query('playerA') playerA:string, @Query('playerB') playerB:string, @Query('winner') winner:string, @Query('isDraw') isDraw:boolean): string {
        return `playerA: ${playerA}, playerB: ${playerB}, winner: ${winner}, isDraw: ${isDraw}`;
    }

    @Get(':id')
    findMatchById(@Param('id') id: string): Promise<Match> {
        return this.matchService.findMatchById(id);
    }

    @Get(':id/:other')
    findOneWith(@Param() params: any): string {
        console.log(params);
        return `This action returns a ${params.id} match with ${params.other} other param`;
    }

    @Post()
    createMatch(@Body(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true, transform: true})) body: CreateMatchDto): Promise<Match> {
        return this.matchService.createMatch(body);
    }

    @Put(':id')
    updateMatch(@Param('id') id: string, @Body() body:UpdateMatchDto): Promise<Match> {
        // Logic to update a match by id
        return this.matchService.updateMatch(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        // Logic to delete a match by id
        this.matchService.deleteMatch(id);
    }
}