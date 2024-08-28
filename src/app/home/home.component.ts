import {Component, OnInit} from '@angular/core';
import {Match} from "../core/model/match";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {FlexModule} from "@angular/flex-layout";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {RoutingService} from "../core/routing/routing.service";
import {MatchService} from "../core/integration/match.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Account} from "../core/model/account";
import {DialogService} from "../core/dialog/dialog.service";
import {DateUtils} from "../core/utils/dateUtils";
import {NotificationService} from "../core/integration/notification.service";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        FlexModule,
        MatCard,
        MatButton,
      MatProgressSpinnerModule
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoadingTable = false;
  matchesTable: Match[];
  displayedColumns: string[] = ['name', 'date', 'time', 'location','comments','sport','owner','participants'];
  protected readonly DateUtils = DateUtils;

  constructor(private matchService: MatchService,
              private routingService: RoutingService,
              private dialogService: DialogService,
              private notificationService: NotificationService
  ) {
    this.matchesTable = [];

  }

  ngOnInit(): void {
    this.updateMatchTable();
    this.notificationService.loadUserNotifications();
  }
  routeToCreateMatch() {
    this.routingService.redirectTo('match', false);
  }
  updateMatchTable() {
    this.isLoadingTable = true;
    this.matchService.getMatches()
      .subscribe({
    next: matches => {
      this.matchesTable = matches;
    },
      error: error => {
      console.error('error in updating updateMatchTable'+error)
    },
      complete: () => {
      this.isLoadingTable = false; // Hide the loading spinner
    }
  });

  }
  getMatchTable(){
    return this.matchesTable;
  }

  getOwnerLabel(owner: Account) {
    return owner.name;
  }
  getParticipantsLabel(participants: Account[]) {
    let label = '';
    let separator = ', ';
    participants.forEach(account =>{
      if (participants.indexOf(account) === participants.length -1){
        separator = '';
      }
      label = label.concat(account.name+separator);
    })
    return label;
  }

  showMatch(row: Match) {
    this.dialogService.showMatchDialog(row);
  }


}
