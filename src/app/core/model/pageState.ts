export interface PageState {
  isCreateState(): boolean;
  isUpdateState(): boolean;
  isReadOnlyState(): boolean;
  isOwnerState(): boolean;
  isParticipatingState(): boolean;
}
class PageStatePattern implements PageState {
  isCreateState(): boolean {
    return false;
  }
  isUpdateState(): boolean {
    return false;
  }
  isReadOnlyState(): boolean {
    return false;
  }
  isOwnerState(): boolean {
    return false;
  }
  isParticipatingState(): boolean {
    return false;
  }
}
export class CreateState extends PageStatePattern {
  override isCreateState(): boolean {
    return true;
  }
}
export class UpdateState extends PageStatePattern {
  override isUpdateState(): boolean {
    return true;
  }
}
export class ReadOnlyState extends PageStatePattern {
  override isReadOnlyState(): boolean {
    return true;
  }
}
export class OwnerState extends PageStatePattern {
  override isOwnerState(): boolean {
    return true;
  }
}
export class ParticipatingState extends PageStatePattern {
  override isParticipatingState(): boolean {
    return true;
  }
}

