// src/common/guards/delete-country-token.guard.ts

import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeleteCountryTokenGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const tokenFromHeader =
            request.headers['delete-token'] ||
            request.headers['DELETE-TOKEN'.toLowerCase()];

        const expectedToken =
            this.configService.get<string>('COUNTRIES_DELETE_TOKEN');

        if (!expectedToken) {
            throw new ForbiddenException(
                'Delete operation is not configured on this server',
            );
        }

        if (!tokenFromHeader || tokenFromHeader !== expectedToken) {
            throw new ForbiddenException('Invalid or missing delete token');
        }

        return true;
    }
}
