import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { tap } from 'rxjs/operators';

import { ItemStore } from '../store/item/item.store';

let URL = `${environment.url}/items`

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
      .get<Item[]>(URL)
      .pipe(
        tap((data: Item[]) => this.itemStore.set('items', data.reverse()))
      )
      .subscribe();
  }

  updateItem(item : Item) : void {
    this.http
      .put<Item>(URL + '/' + item.id, item)
      .subscribe({
        next: _ => {
            this.init();
        },
        error: error => {
            console.error('Impossible de mettre à jour l\'item!', error, item);
        }
    });
  }

  addItem(item : Item) {
    return this.http
      .post<Item>(URL, item).pipe(
        tap(_ => console.log(`updated hero id=${item.id}`))
      );
  }

  // generateSellsFromItems(items: Item[]): Sell[] {
  //   return items.reduce((acc: Sell[], item: Item) => {
  //     let sells = item.sells;
  //     sells?.forEach(sell => {
  //       let formatedItem = {...item};
  //       formatedItem.sells = [];
  //       sell.item = formatedItem;
        
  //       acc.push(sell);
  //     });
  //     return acc;
  //   }, [] as Sell[]);
  // }

  getAllItemsNames() : String[] {
    return this.itemStore.get('items').map(item => item.itemName);
  }
}
