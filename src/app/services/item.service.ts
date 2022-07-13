import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { tap } from 'rxjs/operators';

import { ItemStore } from '../store/item/item.store';

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
}
