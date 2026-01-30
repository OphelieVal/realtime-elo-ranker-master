import { Controller, Get, Param, Post, Body, ValidationPipe, Put, Delete, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';

@Controller('api/player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Get()
    findAllPlayers(): Promise<Player[]> {
        return this.playerService.findAllPlayers();
    }

    @Get('query')
    findAllQuery(@Query('rank') rank:number ) : string {
        return `rank: ${rank}`;
    }

    @Get(':id')
    findPlayerById(@Param('id') id: string): Promise<Player> {
        return this.playerService.findPlayerById(id);
    }

    @Get(':id/:other')
    findOneWith(@Param() params: any): string {
        console.log(params);
        return `This action returns a ${params.id} match with ${params.other} other param`;
    }

    @Post()
    createPlayer(@Body(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true, transform: true})) body: CreatePlayerDto): Promise<Player> {
        return this.playerService.createPlayer(body);
    }

    @Put(':id')
    updatePlayer(@Param('id') id: string, @Body() body:UpdatePlayerDto): Promise<Player> {
        // Logic to update a player by id
        return this.playerService.updatePlayer(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        // Logic to delete a player by id
        this.playerService.deletePlayer(id);
    }
}