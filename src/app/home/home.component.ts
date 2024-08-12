import { Component } from '@angular/core';
import {MockResponseService} from "../core/integration/mock-response.service";
import {Match} from "../core/model/match";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {FlexModule} from "@angular/flex-layout";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {RoutingService} from "../core/routing/routing.service";

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
        MatButton
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  mockTable: Match[];
  displayedColumns: string[] = ['name', 'date', 'hour', 'location','comments','sport','owner','participants'];
  constructor(private mockService: MockResponseService,
              private routingService: RoutingService
  ) {
    this.mockTable = mockService.getMockMatches();
  }

  routeToCreateMatch() {
    this.routingService.redirectTo('match', false);
  }
}
