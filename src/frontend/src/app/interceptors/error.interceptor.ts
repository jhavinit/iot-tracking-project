import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

@Injectable() export class ErrorInterceptor implements HttpInterceptor {
  /**
   * `notifier`
   * notification service
   */
  private readonly notifier: NotifierService;

  /**
   * `constructor`
   * @param router
   * @param notifierService
   */
  constructor(
    notifierService: NotifierService,
    private router: Router,
  ) {
    this.notifier = notifierService;
  }

  /**
   * `intercept`
   * error interceptor
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        /**
         * modify response
         */
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        /**
         * throw err based on type
         */
        if (err.error.success === undefined) {
          this.notifier.notify('error', 'Oops something went wrong! Please check your connection and try again later');
        } else {
          this.notifier.notify('error', err.error.msg);
        }

        /**
         * if internal server error
         */
        if (err.status === 500) {
          this.router.navigate(['error/500']);
        }
      }
    });
  }
}

