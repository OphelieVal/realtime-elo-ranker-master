import { PartialType } from '@nestjs/swagger';
import { BasePlayerDto } from './basePlayer.dto';

/**
 * Data Transfer Object for updating a player.
 */
export class UpdatePlayerDto extends PartialType(BasePlayerDto) {}