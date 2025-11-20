// src/countries/countries.controller.ts

import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDto } from '../common/dtos/country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<CountryDto[]> {
    return this.countriesService.findAll();
  }

  @Get(':code')
  async findOneByCode(@Param('code') code: string): Promise<CountryDto> {
    return this.countriesService.findByAlpha3(code);
  }
}
