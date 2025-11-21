// src/travel-plans/travel-plans.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from '../common/dtos/create-travel-plan.dto';
import { TravelPlanDto } from '../common/dtos/travel-plan.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) { }

  @Post()
  async create(@Body() dto: CreateTravelPlanDto): Promise<TravelPlanDto> {
    return this.travelPlansService.create(dto);
  }

  @Get()
  async findAll(): Promise<TravelPlanDto[]> {
    return this.travelPlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TravelPlanDto> {
    return this.travelPlansService.findOne(id);
  }
}
