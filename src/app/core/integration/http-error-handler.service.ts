import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {MessageService} from "../message/message.service";
import {RoutingService} from "../routing/routing.service";

export type HandleError =
  <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;


@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandler {
  constructor(private messageService: MessageService,
              private routingService: RoutingService) { }

  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') =>
    <T>(operation = 'operation', result = {} as T) =>
      this.handleError(serviceName, operation, result);

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   *
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */

   handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {

      console.error(error); // log to console instead
      switch (error.status) {
        case 401:
          console.error('Unauthorized request');
          localStorage.clear();
          break;
        case 403:
          console.error('Forbidden request');
          localStorage.clear();
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 409:
          console.error('Username is already taken');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('Unknown error');
          break;
      }
      //Always send to default page if error occurs
      this.routingService.redirectTo('', false);

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);

      // Let the app keep running by returning a safe result.
      return of( result );
    };

  }
}
