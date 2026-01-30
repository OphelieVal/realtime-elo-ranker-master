import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

/**
 * Data Transfer Object logic for a player
 */
export class BasePlayerDto {
    @IsString()
    @IsNotEmpty()
    id? : string;
    
    @IsNumber()
    @Min(1)
    rank?: number;
}