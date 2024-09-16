import CryptoJS from 'crypto-js';

export class ChangeHelper {
  private initialState: string;

  constructor(values: any[]) {
    this.initialState = this.computeHash(values);
  }

  hasAnyChange(values: any[]): boolean {
    const currentState = this.computeHash(values);
    return currentState !== this.initialState;
  }

  private computeHash(values: any[]): string {
    const jsonString = JSON.stringify(values);
    return CryptoJS.SHA256(jsonString).toString();
  }
}
