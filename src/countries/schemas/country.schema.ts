// src/countries/schemas/country.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country {
  @Prop({ required: true, unique: true })
  alpha3Code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  subregion: string;

  @Prop({ required: true })
  capital: string;

  @Prop({ required: true })
  population: number;

  @Prop({ required: true })
  flagUrl: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
