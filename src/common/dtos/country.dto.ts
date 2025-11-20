// src/common/dtos/country.dto.ts

export class CountryDto {
  alpha3Code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
  source?: 'api' | 'cache';
}
