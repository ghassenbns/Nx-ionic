import { HttpResponseBase } from '@angular/common/http';

export interface CustomHttpError<T> extends HttpResponseBase {
  error: {
    code: string | number;
    message: string;
    status: string | number;
    data: T[];
  };
}
