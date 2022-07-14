import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Item } from '../../models/item';
import { ItemStore } from '../../store/item/item.store';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  items$: Observable<Item[]>;

  constructor(
    private store: ItemStore
  ) {
    this.items$ = this.store.select("items");
  }

  ngOnInit(): void {
  }

}
