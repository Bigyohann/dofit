import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sell, SellItem } from '../models/sell';
import { Observable } from 'rxjs';
import { reduce, map } from 'rxjs/operators';

import { Item } from '../models/item';
import { SellStore } from '../store/sell/sell.store';
import { ItemStore } from '../store/item/item.store';
import { SellService } from './sell.service';

let URL = `${environment.url}/sells`

@Injectable({
  providedIn: 'root'
})
export class StatsService {

    items$!: Observable<Item[]>;
    sells$!: Observable<Sell[]>;

    constructor(
        private sellStore: SellStore,
        private itemStore: ItemStore,
        private sellService: SellService,
    ) { 
        this.items$ = this.itemStore.select('items');
        this.sells$ = this.sellStore.select('sells');
    }

    getProfitFromSells(): Observable<number> {
        return this.sells$.pipe(
            map(sells => sells.filter(sell => !sell.sold)),
            map(sells => sells.reduce((acc, sell: Sell) => acc + sell.profit, 0))
        );
    }

    getMostProfitableSellItem(): Observable<SellItem> {
        return this.sells$.pipe(
            map(sells => sells.reduce((acc, sell: Sell) => {
                acc = acc.profit > sell.profit ? acc : sell;
                return acc;
            }, {} as Sell)),
            map(sell => this.sellService.getSellItemFromSell(sell))
        );
    }

    getMostMargablSellItem(): Observable<SellItem> {
        return this.sells$.pipe(
            map(sells => sells.reduce((acc, sell: Sell) => {
                acc = acc.margin > sell.margin ? acc : sell;
                return acc;
            }, {} as Sell)),
            map(sell => this.sellService.getSellItemFromSell(sell))
        );
    }

    getBestRateSellItem(): Observable<SellItem> {
        return this.sells$.pipe(
            map(sells => sells.reduce((acc, sell: Sell) => {
                acc = acc.profit / acc.margin > sell.margin /sell.profit ? acc : sell;
                return acc;
            }, {} as Sell)),
            map(sell => this.sellService.getSellItemFromSell(sell))
        );
    }
}
