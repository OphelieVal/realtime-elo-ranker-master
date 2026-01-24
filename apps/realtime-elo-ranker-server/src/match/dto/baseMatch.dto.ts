import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

/**
 * Data Transfer Object representing the basic structure of a match.
 */
export class BaseMatchDto {
    @IsString()
    @IsNotEmpty()
    opponent1: string;
    
    @IsString()
    @IsNotEmpty()
    opponent2: string;
    
    @IsInt()
    @Min(0)
    score1: number;
    
    @IsInt()
    @Min(0)
    score2: number;
}