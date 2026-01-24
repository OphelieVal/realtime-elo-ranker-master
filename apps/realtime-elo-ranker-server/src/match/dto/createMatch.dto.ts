import { OmitType } from '@nestjs/swagger';
import { BaseMatchDto } from './baseMatch.dto';

/**
 * Data Transfer Object for creating a match, excluding scores.
 */
export class CreateMatchDto extends OmitType(BaseMatchDto, ['score1', 'score2'] as const) {}