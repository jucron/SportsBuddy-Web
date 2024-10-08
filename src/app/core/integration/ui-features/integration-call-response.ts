export class IntegrationCallResponse {
  data: any;
  operationType: string;
  success: boolean;


  constructor(data: any, operationType: string, success: boolean) {
    this.data = data;
    this.operationType = operationType;
    this.success = success;
  }

  static getSuccess(data: any, operationType: string) {
    return new IntegrationCallResponse(data, operationType, true);
  }
  static getFail(operationType: string) {
    return new IntegrationCallResponse(null, operationType, false);
  }
}
