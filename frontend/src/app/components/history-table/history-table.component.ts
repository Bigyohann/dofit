import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Sell } from 'src/app/models/sell';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss']
})
export class HistoryTableComponent implements OnInit, OnChanges {

  @Input()
  items!: Item[];

  sells!: Sell[];

  columnsToDisplay = ['name', 'purchase-price', 'selling-price', 'profit', 'margin', 'sold'];

  constructor(private itemService: ItemService) {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']){
      this.sells = this.itemService.generateSellsFromItems(this.items);
      console.log(this.sells);
    }
  }

  ngOnInit(): void {
    
  }

}
