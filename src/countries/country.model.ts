// src/countries/country.model.ts

export interface Country {
  alpha3Code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
