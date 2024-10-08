import {Injectable} from '@angular/core';
import {DialogService} from "../../dialog/dialog.service";
import {AlertService} from "../../alert/alert.service";
import {catchError, finalize, map, Observable, of} from "rxjs";
import {IntegrationCallResponse} from "./integration-call-response";
import {UIServiceParams} from "./ui-service-params";


@Injectable({
  providedIn: 'root'
})
export class IntegrationUiService {
  isLoading: boolean = false;

  constructor(
    private dialogService: DialogService,
    private alertService: AlertService
  ) {}

  executeCall<T> (operation: Observable<IntegrationCallResponse>, serviceParams: UIServiceParams): Observable<T | null> {
    this.isLoading = true;
    let operationType = '';
    if (serviceParams.hasLoadingDialog()) { this.dialogService.showLoadingDialog(); }
    return operation.pipe(
      map(
        callResponse => {
          operationType = callResponse.operationType;
          if (callResponse.success) {
            return callResponse.data as T;
          } else {
            throw new Error(callResponse.data);
          }
        }
      ),
      finalize(() => {
        this.isLoading = false;
        if (serviceParams.hasLoadingDialog()) { this.dialogService.closeLoadingDialog(); }
        if (serviceParams.hasSuccessAlert()) { this.alertSuccess(operationType); }
      }),
      catchError((error) => {
        console.warn(`operation ${operationType} failed`, error)
        if (serviceParams.haseErrorAlert()) { this.alertError(operationType); }
        return of(null);
      })
    );
  }


  private alertError(operationType: string) {
    switch (operationType) {
      case 'getMatches':
        this.alertService.alertGetMatchesError();
        break;
    }
  }

  private alertSuccess(operationType: string) {
  }
}
