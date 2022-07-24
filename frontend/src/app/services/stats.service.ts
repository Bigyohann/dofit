import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sell, SellItem } from '../models/sell';
import { Observable, combineLatest} from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { Item } from '../models/item';
import { SellStore } from '../store/sell/sell.store';
import { ItemStore } from '../store/item/item.store';
import { SellService } from './sell.service';
import { BarChartData, LineChartData, MONTHS, PieChartData } from '../models/charts-data';

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
                acc = acc.profit * acc.margin > sell.profit * sell.margin ? acc : sell;
                return acc;
            }, {} as Sell)),
            map(sell => this.sellService.getSellItemFromSell(sell))
        );
    }

    getTotalTurnover(): Observable<number> {
        return this.sells$.pipe(
            map(sells => sells.filter(sell => sell.sold)),
            map(sells => sells.reduce((acc, sell: Sell) => acc + sell.sellingPrice, 0))
        );
    }

    getExpectedTurnover(): Observable<number> {
        return this.sells$.pipe(
            map(sells => sells.reduce((acc, sell: Sell) => acc + sell.sellingPrice, 0))
        );
    }

    getTotalProfit(): Observable<number> {
        return this.sells$.pipe(
            map(sells => sells.filter(sell => sell.sold)),
            map(sells => sells.reduce((acc, sell: Sell) => acc + sell.profit, 0))
        );
    }

    getExpectedProfit(): Observable<number> {
        return this.sells$.pipe(
            map(sells => sells.reduce((acc, sell: Sell) => acc + sell.profit, 0))
        );
    }

    getTotalTurnoverGraphData(): Observable<LineChartData[]> {
        return this.sells$.pipe(
            map(sells => sells.filter(sell => sell.sold && sell.sellingDate)),
            map(sells => sells.sort((a, b) => {
                if (a?.sellingDate && b?.sellingDate) {
                    return a.sellingDate > b?.sellingDate ? 1 : -1
                }
                return 0;
            })),
            map(sells => sells.reduce((acc, sell) => {
                const sellingDate = sell.sellingDate as Date;
                const lastItem = acc[acc.length-1]
                if (sellingDate.getMonth() !== acc[acc.length-1]?.month.value) {
                    acc.push({
                        value: (lastItem?.value || 0) + sell.sellingPrice,
                        month: {
                            value: sellingDate.getMonth(),
                            label: MONTHS[sellingDate.getMonth()]
                        }
                    })
                } else {
                    lastItem.value = lastItem.value + sell.sellingPrice;
                }
                return acc;
            }, [] as LineChartData[])),
        )
    }

    getExpectedTurnoverGraphData(): Observable<LineChartData[]> {
        return combineLatest([
                this.getTotalTurnoverGraphData(),
                this.getExpectedProfit()
            ]).pipe(
                map(([chartData, profit]) => {
                    console.log(chartData, profit)
                    const lastData = chartData[chartData.length - 1];
                    chartData.push({
                        value: profit + lastData.value,
                        month: {
                            value: lastData.month.value + 1,
                            label: MONTHS[lastData.month.value + 1]
                        }
                    });
                    return chartData;
                })
            )
    }

    getTotalProfitGraphData(): Observable<LineChartData[]> {
        return this.sells$.pipe(
            map(sells => sells.filter(sell => sell.sold && sell.sellingDate)),
            map(sells => sells.sort((a, b) => {
                if (a?.sellingDate && b?.sellingDate) {
                    return a.sellingDate > b?.sellingDate ? 1 : -1
                }
                return 0;
            })),
            map(sells => sells.reduce((acc, sell) => {
                const sellingDate = sell.sellingDate as Date;
                const lastItem = acc[acc.length-1]
                if (sellingDate.getMonth() !== acc[acc.length-1]?.month.value) {
                    acc.push({
                        value: (lastItem?.value || 0) + sell.profit,
                        month: {
                            value: sellingDate.getMonth(),
                            label: MONTHS[sellingDate.getMonth()]
                        }
                    })
                } else {
                    lastItem.value = lastItem.value + sell.profit;
                }
                return acc;
            }, [] as LineChartData[])),
        )
    }

    getLevelSpreadingGraphData(): Observable<BarChartData[]> {
        return this.items$.pipe(
            map(items => items.map(item => item.level)),
            map(levels => levels.sort((a, b) => {
                if (a && b) {
                    return a > b ? 1 : -1
                }
                return 0;
            })),
            map(levels => levels.reduce((acc, level) => {
                console.log('levels', levels)
                const lastItem = acc[acc.length-1]
                if (!lastItem || lastItem.range.max < level) {
                    let maxLevel = Math.floor(level / 10) * 10;
                    maxLevel = (maxLevel/10) % 2 === 0 ? maxLevel + 20 : maxLevel + 10;

                    let minLevel = maxLevel - 20;
                    minLevel = minLevel < 0 ? 0 : minLevel
                    
                    acc.push({
                        value: 1,
                        range: {
                            max: maxLevel,
                            label: `${minLevel === 200 ? minLevel - 20 : minLevel} à ${maxLevel === 220 ? maxLevel - 20 : maxLevel - 1}`
                        }
                    })
                } else {
                    lastItem.value++;
                }
                return acc;
            }, [] as BarChartData[]))
        )
    }

    getProfessionSpreadingGraphData(): Observable<PieChartData[]> {
        return this.items$.pipe(
            map(items => items.map(item => item.profession)),
            map(professions => professions.sort((a, b) => {
                if (a && b) {
                    return a > b ? 1 : -1
                }
                return 0;
            })),
            map(professions => professions.reduce((acc, profession) => {
                console.log('profession', profession)
                const lastItem = acc[acc.length-1]
                if (!lastItem || lastItem.label != profession) {
                    acc.push({
                        value: 1,
                        label: profession
                    })
                } else {
                    lastItem.value++;
                }
                return acc;
            }, [] as PieChartData[]))
        )
    }
}
