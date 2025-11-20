// src/common/dtos/travel-plan.dto.ts

export class TravelPlanDto {
  id: string;
  countryCode: string;
  title: string;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}
