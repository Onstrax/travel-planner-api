// src/countries/countries.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { CountryDto } from '../common/dtos/country.dto';
import { RestCountriesProvider } from './rest-countries.provider';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    private readonly restCountriesProvider: RestCountriesProvider,
  ) {}

  private toDto(
    country: CountryDocument,
    source?: 'api' | 'cache',
  ): CountryDto {
    return {
      alpha3Code: country.alpha3Code,
      name: country.name,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital,
      population: country.population,
      flagUrl: country.flagUrl,
      source,
    };
  }

  async findAll(): Promise<CountryDto[]> {
    const countries = await this.countryModel.find().exec();
    return countries.map((c) => this.toDto(c, 'cache'));
  }

  async findByAlpha3(alpha3Code: string): Promise<CountryDto> {
    const code = alpha3Code.toUpperCase();

    // 1) Buscar en caché (Mongo)
    const cached = await this.countryModel.findOne({ alpha3Code: code }).exec();
    if (cached) {
      return this.toDto(cached, 'cache');
    }

    // 2) No está en caché: pedir a RestCountries
    const countryFromApi = await this.restCountriesProvider.getCountryByCode(
      code,
    );

    // 3) Guardar en BD
    const created = new this.countryModel({
      alpha3Code: countryFromApi.alpha3Code,
      name: countryFromApi.name,
      region: countryFromApi.region,
      subregion: countryFromApi.subregion,
      capital: countryFromApi.capital,
      population: countryFromApi.population,
      flagUrl: countryFromApi.flagUrl,
    });

    const saved = await created.save();

    return this.toDto(saved, 'api');
  }
}
