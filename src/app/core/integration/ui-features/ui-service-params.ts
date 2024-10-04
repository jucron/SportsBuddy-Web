export class UIServiceParams {
  private _loadingDialog: boolean = false;
  private _successAlert: boolean = false;
  private _errorAlert: boolean = false;

  private constructor() {  }

  static builder(): UIServiceParams {
    return new UIServiceParams();
  }

  withLoadingDialog(): UIServiceParams {
    this._loadingDialog = true;
    return this;
  }

  withSuccessAlert(): UIServiceParams {
    this._successAlert = true;
    return this;
  }

  withErrorAlert(): UIServiceParams {
    this._errorAlert = true;
    return this;
  }

  build(): UIServiceParams {
    return this;
  }

  hasLoadingDialog(): boolean {
    return this._loadingDialog;
  }

  hasSuccessAlert(): boolean {
    return this._successAlert;
  }

  haseErrorAlert(): boolean {
    return this._errorAlert;
  }
}
