// src/countries/countries.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { RestCountriesProvider } from './rest-countries.provider';
import { Country, CountrySchema } from './schemas/country.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, RestCountriesProvider],
  exports: [CountriesService],
})
export class CountriesModule {}
