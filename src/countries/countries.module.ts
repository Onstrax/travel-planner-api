// src/countries/countries.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { RestCountriesProvider } from './rest-countries.provider';
import { Country, CountrySchema } from './schemas/country.schema';
import { DeleteCountryTokenGuard } from 'src/common/guards/delete-country-token.guard';
import { TravelPlan, TravelPlanSchema } from '../travel-plans/schemas/travel-plan.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: TravelPlan.name, schema: TravelPlanSchema },
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, RestCountriesProvider, DeleteCountryTokenGuard],
  exports: [CountriesService],
})
export class CountriesModule { }
