import { Injectable } from '@angular/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {

  constructor(private readonly toastr: ToastrService) {
  }

  show(message: string, title: string, type: 'success' | 'error' | 'info' | 'warning',
       options: Partial<IndividualConfig> = {}): ActiveToast<any> | null {

    const params = {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      tapToDismiss: true,
      ...options,
    };

    switch (type) {
      case 'success':
        return this.toastr.success(message, title, params);
      case 'error':
        return this.toastr.error(message, title, params);
      case 'info':
        return this.toastr.info(message, title, params);
      case 'warning':
        return this.toastr.warning(message, title, params);
      default:
        return null;
    }

  }
}
