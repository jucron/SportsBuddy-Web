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
import {STORAGE_KEYS} from "../core/keys/storage-keys";

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
  matchesTable: Match[] = [];
  displayedColumns: string[] = ['name', 'date', 'time', 'location','comments','sport','owner','participants'];
  protected readonly DateUtils = DateUtils;

  constructor(private matchService: MatchService,
              private routingService: RoutingService,
              private dialogService: DialogService,
              private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.updateMatchTable();
    this.notificationService.loadUserNotifications();
  }
  routeToCreateMatchOrMatchRoom() {
    let myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
    const direction = myMatchId ? `match-room/${myMatchId}/owner` : 'match';
    this.routingService.redirectTo(direction, false);
  }
  updateMatchTable() {
    this.isLoadingTable = true;
    this.matchService.getMatches()
      .subscribe({
    next: matchResponse => {
      this.matchesTable = matchResponse.matches;
    },
      error: error => {
      console.error('error in updating updateMatchTable'+error)
    },
      complete: () => {
      this.isLoadingTable = false; // Hide the loading spinner
    }
  });
  }
  getMatchTable() {
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
    console.log('showMatch triggered from HomeComponent: id - '+row.id);
    this.matchService.getMatch(row.id)
      .subscribe(match => {
        this.dialogService.showMatchDialog(match);
      });
  }

  getMyMatchLabel() {
    return this.matchService.getMyMatchLabel();
  }
}
