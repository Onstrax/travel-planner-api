// src/travel-plans/travel-plans.service.ts

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    TravelPlan,
    TravelPlanDocument,
} from './schemas/travel-plan.schema';
import { CreateTravelPlanDto } from '../common/dtos/create-travel-plan.dto';
import { TravelPlanDto } from '../common/dtos/travel-plan.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
    constructor(
        @InjectModel(TravelPlan.name)
        private readonly travelPlanModel: Model<TravelPlanDocument>,
        private readonly countriesService: CountriesService,
    ) { }

    private toDto(doc: TravelPlanDocument): TravelPlanDto {
        return {
            id: doc._id.toString(),
            countryCode: doc.countryCode,
            title: doc.title,
            startDate: doc.startDate.toISOString(),
            endDate: doc.endDate.toISOString(),
            notes: doc.notes,
            createdAt: doc.createdAt.toISOString(),
        };
    }

    private validateDates(start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        if (startDate >= endDate) {
            throw new BadRequestException(
                'startDate must be earlier than endDate',
            );
        }

        return { startDate, endDate };
    }

    async create(dto: CreateTravelPlanDto): Promise<TravelPlanDto> {
        // 1) Validar país (esto también lo cachea si no existe)
        await this.countriesService.findByAlpha3(dto.countryCode);

        // 2) Validar fechas
        const { startDate, endDate } = this.validateDates(
            dto.startDate,
            dto.endDate,
        );

        // 3) Crear documento
        const created = new this.travelPlanModel({
            countryCode: dto.countryCode.toUpperCase(),
            title: dto.title,
            startDate,
            endDate,
            notes: dto.notes,
        });

        const saved = await created.save();
        return this.toDto(saved);
    }

    async findAll(): Promise<TravelPlanDto[]> {
        const plans = await this.travelPlanModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
        return plans.map((p) => this.toDto(p));
    }

    async findOne(id: string): Promise<TravelPlanDto> {
        const plan = await this.travelPlanModel.findById(id).exec();
        if (!plan) {
            throw new NotFoundException(`Travel plan with id ${id} not found`);
        }
        return this.toDto(plan);
    }
}
