import { IsNumber } from 'class-validator';

export class LocationQuery {
  @IsNumber()
  code: number;
}
