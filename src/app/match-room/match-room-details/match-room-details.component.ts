import {Component, Input, OnInit} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {FormErrorComponent} from "../../core/helper-components/form-error/form-error.component";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {NgForOf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {PageState} from "../../core/model/pageState";
import {FactoryService} from "../../core/factory/factory.service";
import {AccountService} from "../../core/integration/account.service";
import {DialogService} from "../../core/dialog/dialog.service";
import {DateUtils} from "../../core/utils/dateUtils";
import {Match} from "../../core/model/match";
import {ChangeHelper} from "../../core/audit/changeHelper";

@Component({
  selector: 'app-match-room-details',
  standalone: true,
    imports: [
        FlexModule,
        FormErrorComponent,
        MatButton,
        MatCard,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        MatToolbar,
        MatTooltip,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './match-room-details.component.html',
  styleUrl: './match-room-details.component.css'
})
export class MatchRoomDetailsComponent implements OnInit{
  @Input() currentState!: PageState;
  @Input() match: Match | null = null;
  matchForm: FormGroup;
  changeHelper!: ChangeHelper;

  constructor(private accountService: AccountService,
              private dialogService: DialogService,
              private factoryService: FactoryService,
  ) {
    this.matchForm = this.factoryService.getFormFactory().createMatchForm()
  }
  ngOnInit(): void {
    if (this.match) {
      this.setMatchFormValues();
      this.showMatchRequests();
    }
  }
  onSubmit() {
    //todo updateMatchDetails
  }
  onCancelMatch() {
    //todo cancelMatch
  }
  private setMatchFormValues() {
    if (this.match) {
          this.matchForm.patchValue({
            id: this.match.id,
            name: this.match.name,
            date: this.match.date,
            time: DateUtils.getTimeFromDate(this.match.date),
            location: this.match.location,
            comments: this.match.comments,
            sport: this.match.sport
          });
      this.changeHelper = new ChangeHelper([this.matchForm.value])
    }
  }
  showAccountDialog(accountId: string) {
    this.accountService.getAccount(accountId)
      .subscribe(account => {
        this.dialogService.showAccountDialog(account!);
      });
  }
  isUpdateDisabled() {
    return this.matchForm.invalid || !this.changeHelper.hasAnyChange([this.matchForm.value]);
  }
  hasAnyMatchRequest() {
    return this.match!.matchRequests.length > 0;
  }
  private showMatchRequests() {
    if (this.hasAnyMatchRequest()) {
      this.dialogService.showMatchRequestsDialog(this.match!.matchRequests);
    }
  }
}
