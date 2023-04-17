import { Injectable, NestInterceptor, ExecutionContext, CallHandler, } from '@nestjs/common';
import { Observable, } from 'rxjs';
import { tap, } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<{
			method: string;
			originalUrl: string;
		}>();

		const method = request.method;
		const url = request.originalUrl;
		console.log(method, url)
		return next.handle().pipe(
			tap((response) => console.log('Response:', response))
		);
	}
}
