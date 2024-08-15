export interface AccountState {
  isCreateState(): boolean;
  isUpdateState(): boolean;
  isReadOnlyState(): boolean;
}

export class CreateState implements AccountState {
  isCreateState(): boolean {
    return true;
  }

  isReadOnlyState(): boolean {
    return false;
  }

  isUpdateState(): boolean {
    return false;
  }
}

export class UpdateState implements AccountState {
  isCreateState(): boolean {
    return false;
  }

  isReadOnlyState(): boolean {
    return false;
  }

  isUpdateState(): boolean {
    return true;
  }
}

export class ReadOnlyState implements AccountState {
  isCreateState(): boolean {
    return false;
  }

  isReadOnlyState(): boolean {
    return true;
  }

  isUpdateState(): boolean {
    return false;
  }
}

