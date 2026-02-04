import { Controller, Post, Body } from "@nestjs/common";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./dto/createMatch.dto";

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post()
    playMatch(@Body() dto: CreateMatchDto) {
        return this.matchService.playMatch(dto);
    }
}