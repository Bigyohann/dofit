import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from 'src/app/models/item';
import { Sell } from 'src/app/models/sell';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoryTableComponent implements OnInit, OnChanges {

  @Input()
  items!: Item[];

  sells!: Sell[];

  dataSource!: MatTableDataSource<Sell>; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  columnsToDisplay = ['name', 'purchase-price', 'selling-price', 'profit', 'margin', 'sold'];
  columnsToDisplayWithActions = [...this.columnsToDisplay, 'expand'];

  expandedElement: Sell | null = null;

  constructor(private itemService: ItemService) {
  }

  numberWithSpaces(number : number) : String{
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    console.log('filter', filterValue.trim().toLowerCase())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !!changes['items'].currentValue){
      this.sells = this.itemService.generateSellsFromItems(this.items);
      this.dataSource = new MatTableDataSource<Sell>(this.sells);
      console.log(this.sells);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (row:Sell, columnName:string) : string => {
        console.log(row, columnName);
        if (columnName == "name") return row.item?.itemName || "";
        if (columnName == "purchase-price") return row.purchasePrice.toString();
        if (columnName == "selling-price") return row.sellingPrice.toString();
        var columnValue = row[columnName as keyof Sell] as string;
        return columnValue;
      }
    }
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (sell: Sell, filter) => {
      return sell.item?.itemName.includes(filter) || false;
   }
  }

}
