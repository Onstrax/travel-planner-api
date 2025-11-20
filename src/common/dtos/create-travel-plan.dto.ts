// src/common/dtos/create-travel-plan.dto.ts

import {
  IsString,
  IsNotEmpty,
  Length,
  IsUppercase,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @IsUppercase()
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
