import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

/**
 * Data Transfer Object logic for a player
 */
export class BasePlayerDto {
    @IsString()
    @IsNotEmpty()
    id : string;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    rank?: number;
}