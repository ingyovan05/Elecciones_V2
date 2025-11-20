
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class AuditFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{
      user?: RequestUser;
      body: any;
      originalUrl?: string;
      url?: string;
    }>();
    const url = request.originalUrl ?? request.url ?? '';
    const skipAudit = url.includes('/auth/login');
    const auditUser = request.user?.sub ?? process.env.ANON_USER_ID;
    if (!skipAudit && request.body && auditUser) {
      request.body.auditUserId = auditUser;
    }
    return next.handle().pipe(
      map((data) => {
        if (data?.auditUserId) {
          delete data.auditUserId;
        }
        return data;
      }),
    );
  }
}
