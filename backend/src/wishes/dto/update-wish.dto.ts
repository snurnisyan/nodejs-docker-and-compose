import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;
}
