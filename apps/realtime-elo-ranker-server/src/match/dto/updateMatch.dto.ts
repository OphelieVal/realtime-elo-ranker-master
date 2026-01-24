import { PartialType } from '@nestjs/swagger';
import { BaseMatchDto } from './baseMatch.dto';

export class UpdateMatchDto extends PartialType(BaseMatchDto) {}