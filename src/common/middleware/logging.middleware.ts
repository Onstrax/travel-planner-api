// src/common/middleware/logging.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const start = Date.now();

        res.on('finish', () => {
            const statusCode = res.statusCode;
            const duration = Date.now() - start;

            console.log(
                `METHOD: ${method} | URL: ${originalUrl} ---> ${statusCode} (${duration}ms)`,
            );
        });

        next();
    }
}
