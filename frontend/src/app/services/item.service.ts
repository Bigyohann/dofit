import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { tap } from 'rxjs/operators';

import { ItemStore } from '../store/item/item.store';
import { Sell } from '../models/sell';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private itemStore: ItemStore,
    private http: HttpClient
  ) { }

  init(): void {
    this.itemStore.set('items', []);
    this.http
      .get<Item[]>(environment.url)
      .pipe(
        tap((data: Item[]) => this.itemStore.set('items', data))
      )
      .subscribe();
  }

  generateSellsFromItems(items: Item[]): Sell[] {
    return items.reduce((acc: Sell[], item: Item) => {
      let sells = item.sells;
      sells?.forEach(sell => {
        sell.itemName = item.itemName;
        acc.push(sell);
      });
      return acc;
    }, [] as Sell[]);
  }
}
