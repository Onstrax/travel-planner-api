// src/travel-plans/travel-plan.model.ts

export interface TravelPlan {
  id?: string;
  countryCode: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  createdAt?: Date;
}
