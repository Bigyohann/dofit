import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Sell } from 'src/app/models/sell';
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

  constructor(
    private itemStore: ItemStore,
    private sellStore: SellStore
  ) {
    this.items$ = this.itemStore.select("items");
    this.sells$ = this.sellStore.select("sells");
  }

  ngOnInit(): void {
  }

}
