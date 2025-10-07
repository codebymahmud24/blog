import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ClassConstructor, plainToInstance } from "class-transformer";

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (!data) return data; // handle null/undefined
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
// এই interceptor ব্যবহার করা হয় response data কে DTO অনুযায়ী serialize করার জন্য, 
// যাতে API থেকে সবসময় safe আর clean data বাইরে যায়।