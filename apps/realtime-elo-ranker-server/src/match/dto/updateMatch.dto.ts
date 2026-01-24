import { PartialType } from '@nestjs/swagger';
import { BaseMatchDto } from './baseMatch.dto';

/**
 * Data Transfer Object for updating a match, allowing partial updates.
 */
export class UpdateMatchDto extends PartialType(BaseMatchDto) {}