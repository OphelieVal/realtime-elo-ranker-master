import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

/**
 * Data Transfer Object for creating a match.
 */
export class CreateMatchDto {
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