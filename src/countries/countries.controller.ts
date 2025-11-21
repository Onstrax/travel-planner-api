// src/countries/countries.controller.ts

import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryDto } from '../common/dtos/country.dto';
import { DeleteCountryTokenGuard } from 'src/common/guards/delete-country-token.guard';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) { }

  @Get()
  async findAll(): Promise<CountryDto[]> {
    return this.countriesService.findAll();
  }

  @Get(':code')
  async findOneByCode(@Param('code') code: string): Promise<CountryDto> {
    return this.countriesService.findByAlpha3(code);
  }

  @UseGuards(DeleteCountryTokenGuard)
  @Delete(':code')
  async deleteOneByCode(@Param('code') code: string): Promise<string> {
    return this.countriesService.deleteFromCache(code);
  }
}
