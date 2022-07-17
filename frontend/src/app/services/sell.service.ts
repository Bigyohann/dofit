import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sell, SellItem } from '../models/sell';
import { tap } from 'rxjs/operators';

import { Item } from '../models/item';
import { SellStore } from '../store/sell/sell.store';
import { ItemStore } from '../store/item/item.store';

let URL = `${environment.url}/sells`

@Injectable({
  providedIn: 'root'
})
export class SellService {

  constructor(
    private sellStore: SellStore,
    private itemStore: ItemStore,
    private http: HttpClient
  ) { }

  init(): void {
    this.sellStore.set('sells', []);
    this.http
      .get<Sell[]>(URL)
      .pipe(
        tap((data: Sell[]) => this.sellStore.set('sells', data.reverse()))
      )
      .subscribe();
  }

  updateSell(sell : Sell) : void {
    this.http
      .put<Sell>(URL + '/' + sell.id, sell)
      .subscribe({
        next: _ => {
            this.init();
        },
        error: error => {
            console.error('Impossible de mettre à jour la vente!', error, sell);
        }
    });
  }

  addSell(sell : Sell) : void {
    this.http
      .post<Sell>(URL, sell)
      .subscribe({
        next: _ => {
            this.init();
        },
        error: error => {
            console.error('Impossible d\'ajouter la vente!', error, sell);
        }
    });
  }

  deleteSell(sell : Sell) : void {
    this.http
      .delete<Sell>(URL + '/' + sell.id)
      .subscribe({
        next: _ => {
            this.init();
        },
        error: error => {
            console.error('Impossible de supprimer la vente!', error, sell);
        }
    });
  }

  getSellItemFromSell(sell: Sell): SellItem {
    let sellItem: SellItem = {
      ...sell,
      item: this.itemStore.get('items').find(item => item.id === sell.item_id)
    }
    return sellItem;
  }

  generateSellsWithItems(items: Item[], sells: Sell[]): SellItem[] {
    return sells.reduce((acc: SellItem[], sell: Sell) => {
      let sellItem: SellItem = {
        ...sell,
        item: items.find(item => item.id === sell.item_id)
      }
      acc.push(sellItem);
      return acc;
    }, [] as SellItem[]);
  }
}
