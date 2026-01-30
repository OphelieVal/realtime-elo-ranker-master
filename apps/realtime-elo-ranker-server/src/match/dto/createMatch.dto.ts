import { IsNotEmpty, IsBoolean, IsString } from "class-validator";

/**
 * Data Transfer Object for creating a match.
 */
export class CreateMatchDto {
    @IsNotEmpty()
    @IsString()
    winner: string;

    @IsNotEmpty()
    @IsString()
    loser: string;

    @IsBoolean()
    draw: boolean;
}