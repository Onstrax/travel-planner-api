// src/countries/rest-countries.provider.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export interface RestCountryData {
  alpha3Code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
}

@Injectable()
export class RestCountriesProvider {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('REST_COUNTRIES_BASE_URL') ??
      'https://restcountries.com/v3.1';
  }

  async getCountryByCode(code: string): Promise<RestCountryData> {
    const alpha3Code = code.toUpperCase();
    const url = `${this.baseUrl}/alpha/${alpha3Code}?fields=name,capital,region,subregion,population,flags,cca3`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));

      const data = response.data;

      if (!data) {
        throw new NotFoundException(
          `Country with code ${alpha3Code} not found in RestCountries API`,
        );
      }

      return {
        alpha3Code: data.cca3,
        name: data.name?.common,
        capital: Array.isArray(data.capital) ? data.capital[0] : data.capital,
        region: data.region,
        subregion: data.subregion,
        population: data.population,
        flagUrl: data.flags?.svg || data.flags?.png,
      };
    } catch (error: any) {
      console.error(
        'RestCountries API error:',
        error.message,
        error.response?.status,
        error.response?.data,
      );

      if (error.response?.status === 404) {
        throw new NotFoundException(
          `Country with code ${alpha3Code} not found in RestCountries API`,
        );
      }

      if (error.response) {
        throw new InternalServerErrorException(
          `RestCountries API error (${error.response.status})`,
        );
      }

      throw new InternalServerErrorException(
        'Could not reach RestCountries API',
      );
    }
  }
}
