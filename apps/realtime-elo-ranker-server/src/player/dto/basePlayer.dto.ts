import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class BasePlayerDto {
    @IsString()
    @IsNotEmpty()
    name? : string;
    
    @IsNumber()
    @Min(1)
    rank?: number;
}