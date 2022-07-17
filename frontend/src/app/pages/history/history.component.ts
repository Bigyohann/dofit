import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Sell, SellItem } from 'src/app/models/sell';
import { SellService } from 'src/app/services/sell.service';
import { StatsService } from 'src/app/services/stats.service';
import { SellStore } from 'src/app/store/sell/sell.store';
import { Item } from '../../models/item';
import { ItemStore } from '../../store/item/item.store';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  items$: Observable<Item[]>;
  sells$: Observable<Sell[]>;

  profitFromSells$: Observable<number>;
  mostProfitableSellItem$: Observable<SellItem>;
  mostMargableSellItem$: Observable<SellItem>;
  bestRateSellItem$: Observable<SellItem>;

  searchProfit?: string;
  searchMargin?: string;
  searchRate?: string;

  colSpan: number = 4;
  rowSpan: string = "200px";

  constructor(
    private itemStore: ItemStore,
    private sellStore: SellStore,
    private sellService: SellService,
    private statsService: StatsService,
    private observer: BreakpointObserver
  ) {
    this.items$ = this.itemStore.select("items");
    this.sells$ = this.sellStore.select("sells");
    this.profitFromSells$ = this.statsService.getProfitFromSells();
    this.mostProfitableSellItem$ = this.statsService.getMostProfitableSellItem();
    this.mostMargableSellItem$ = this.statsService.getMostMargablSellItem();
    this.bestRateSellItem$ = this.statsService.getBestRateSellItem();
  }

  ngOnInit(): void {
    // this.observer.observe(['(max-width: 620px)']).subscribe((res) => {
    //   if (res.matches) {
    //     this.colSpan = 1;
    //     this.rowSpan = "150px";
    //   }
    // });
    // this.observer.observe(['(max-width: 900px)']).subscribe((res) => {
    //   if (res.matches) {
    //     this.colSpan = 2;
    //     this.rowSpan = "150px";
    //   }
    // });
    // this.observer.observe(['(min-width: 901px)']).subscribe((res) => {
    //   if (res.matches) {
    //     this.colSpan = 4;
    //     this.rowSpan = "200px";
    //   }
    // });
    this.observer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe( (state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.XSmall]) {
        console.log( 'Matches XSmall viewport');
        this.colSpan = 1;
        this.rowSpan = "150px";
      }
      if (state.breakpoints[Breakpoints.Small]) {
        console.log( 'Matches Small viewport');
        this.colSpan = 2;
        this.rowSpan = "150px";
      }
      if (state.breakpoints[Breakpoints.Medium]) {
        console.log( 'Matches Medium  viewport');
        this.colSpan = 4;
        this.rowSpan = "200px";
      }
      if (state.breakpoints[Breakpoints.Large]) {
        console.log( 'Matches Large viewport');
        this.colSpan = 4;
        this.rowSpan = "200px";
      }
      if (state.breakpoints[Breakpoints.XLarge]) {
        console.log( 'Matches XLarge viewport');
        this.colSpan = 4;
        this.rowSpan = "200px";
      }
    });
  }

  seeSellItem(sellItem: SellItem, type: string) {
    switch (type){
      case 'rate':
        this.searchRate = sellItem.id;
        this.searchProfit = undefined;
        this.searchMargin = undefined;
        break;
      case 'profit':
        this.searchRate = undefined;
        this.searchProfit = sellItem.id;
        this.searchMargin = undefined;
        break;
      case 'margin':
        this.searchRate = undefined;
        this.searchProfit = undefined;
        this.searchMargin = sellItem.id;
        break;
    }
  }

  resetSeeItems(){
    this.searchRate = undefined;
    this.searchProfit = undefined;
    this.searchMargin = undefined;
  }

  numberWithSpaces(number : number) : String{
    number = Math.round((number + Number.EPSILON) * 100) / 100;
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }

}
