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
import { LevelRange } from '../models/enums';

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
            map(sells => sells.filter(sell => sell.listingDate && sell.sellingDate && sell.sold)),
            map(sells => sells.reduce((acc, sell: Sell) => {
                let differenceSell = (sell.listingDate && sell.sellingDate) && (sell.sellingDate as Date).getTime() - (sell.listingDate as Date).getTime();
                let totalDaysSell = Math.round(differenceSell as number / (1000 * 3600 * 24) * 100) / 100;
                let differenceAcc = (acc.listingDate && sell.sellingDate) && (acc.sellingDate as Date).getTime() - (acc.listingDate as Date).getTime();
                let totalDaysAcc = Math.round(differenceAcc as number / (1000 * 3600 * 24) * 100) / 100;
                acc = acc.margin / (differenceAcc as number) > sell.margin / (differenceSell as number) ? acc : sell;
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
        return this.sells$.pipe(
            map(sells => sells.map(sell => this.sellService.getSellItemFromSell(sell))),
            map(sellItems => sellItems.map(sell => sell.item?.level)),
            map(levels => levels.sort((a, b) => {
                if (a && b) {
                    return a > b ? 1 : -1
                }
                return 0;
            })),
            map(levels => levels.reduce((acc, level) => {
                const lastItem = acc[acc.length-1]
                if (level) {
                    if (!lastItem || lastItem.range.max - 1 < level) {
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
                        lastItem.value = lastItem.value + 1;
                    }
                }
                return acc;
            }, [] as BarChartData[]))
        )
    }

    getProfessionSpreadingGraphData(): Observable<PieChartData[]> {
        return this.sells$.pipe(
            map(sells => sells.map(sell => this.sellService.getSellItemFromSell(sell))),
            map(sellItems => sellItems.map(sell => sell.item?.profession)),
            map(professions => professions.sort((a, b) => {
                if (a && b) {
                    return a > b ? 1 : -1
                }
                return 0;
            })),
            map(professions => professions.reduce((acc, profession) => {
                const lastItem = acc[acc.length-1]
                if (!!profession) {
                    if (!lastItem || lastItem.label != profession) {
                        acc.push({
                            value: 1,
                            label: profession
                        });
                    } else {
                        lastItem.value++;
                    }
                }
                return acc;
            }, [] as PieChartData[]))
        )
    }

    getProfitByProfessionGraphData(): Observable<PieChartData[]> {
        return this.sells$.pipe(
            map(sells => sells.map(sell => this.sellService.getSellItemFromSell(sell))),
            map(sellItems => sellItems.filter(sell => sell.item?.profession && sell.profit)),
            map(sellItems => sellItems.sort((a, b) => {
                if (a.item && b.item) {
                    return a.item?.profession > b.item?.profession ? 1 : -1
                }
                return 0;
            })),
            map(sells => sells.reduce((acc, sell) => {
                if (!!sell.item) {
                    const accValue = acc.find(sellAcc => sellAcc.label === sell.item?.profession)
                    if (!!accValue) {
                        accValue.value += sell.profit;
                    } else {
                        acc.push({
                            label: sell.item.profession,
                            value: sell.profit
                        })
                    }
                }
                return acc;
            }, [] as PieChartData[]))
        )
    }

    getMarginByLevelGraphData(): Observable<PieChartData[]> {
        return this.sells$.pipe(
            map(sells => sells.map(sell => this.sellService.getSellItemFromSell(sell))),
            map(sellItems => sellItems.filter(sell => sell.item?.level && sell.profit)),
            map(sellItems => sellItems.sort((a, b) => {
                if (a.item && b.item) {
                    return a.item?.level > b.item?.level ? 1 : -1
                }
                return 0;
            })),
            map(sells => sells.reduce((acc, sell) => {
                if (!!sell.item) {
                    let levelRange = LevelRange.filter(range => sell.item && sell.item.level >= range.min && sell.item.level <= range.max)[0]
                    let levelLabel = levelRange.min + " à " + levelRange.max;
                    const accValue = acc.find(sellAcc => sellAcc.label === levelLabel)
                    if (!!accValue) {
                        accValue.value.push(sell.margin);
                    } else {
                        acc.push({
                            label: levelLabel,
                            value: [sell.margin]
                        })
                    }
                }
                return acc;
            }, [] as any[])),
            map(chartData => {
                console.log(chartData)
                return chartData.map(data => { 
                    return {
                        label: data.label,
                        value: data.value.reduce((a: number, b: number) => a + b, 0) / data.value.length
                    } as PieChartData
                }) as PieChartData[]
            })
        )
    }
}
