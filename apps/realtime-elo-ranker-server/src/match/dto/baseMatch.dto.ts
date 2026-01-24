// updateMatch.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BaseMatchDto {
    @IsString()
    @IsNotEmpty()
    playerA?: string;
    
    @IsString()
    @IsNotEmpty()
    playerB?: string;
    
    @IsString()
    @IsOptional()
    winner?: string;
    
    @IsBoolean()
    @IsOptional()
    isDraw?: boolean;
}