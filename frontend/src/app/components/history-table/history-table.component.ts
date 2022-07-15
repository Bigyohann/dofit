import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from 'src/app/models/item';
import { Sell } from 'src/app/models/sell';
import { ItemService } from 'src/app/services/item.service';
import { SellDialogComponent } from '../sell-dialog/sell-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators'

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

  constructor(
    private itemService: ItemService,
    public dialog: MatDialog
  ) { }

  numberWithSpaces(number : number) : String{
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !!changes['items'].currentValue){
      this.sells = this.itemService.generateSellsFromItems(this.items);
      this.dataSource = new MatTableDataSource<Sell>(this.sells);
      console.log(this.sells);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (row:Sell, columnName:string) : string | number => {
        if (columnName == "name") return row.item?.itemName || "";
        if (columnName == "purchase-price") return row.purchasePrice;
        if (columnName == "selling-price") return row.sellingPrice;
        var columnValue = row[columnName as keyof Sell] as string;
        return columnValue;
      }
      this.dataSource.filterPredicate = (sell, filter) => {
        return (sell.item?.itemName.toLowerCase().includes(filter) || false)
        || (sell.item?.profession.toLowerCase().includes(filter) || false)
        || (sell.item?.category.toLowerCase().includes(filter) || false)
        || (sell.comments?.toLowerCase().includes(filter) || false);
      }
    }
  }

  ngOnInit(): void {
  }

  openAddSellDialog(): void {
    const dialogRef = this.dialog.open(SellDialogComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().pipe(filter(res => !!res)).subscribe((result) => {
      let item: Item | undefined = this.items.find(item => item.itemName === result?.item);

      const sold = result.sold
      const comments = result.comments
      const purchasePrice = result.purchasePrice; 
      const sellingPrice = result.sellingPrice; 
      const profit = sellingPrice - purchasePrice;
      let margin = profit / purchasePrice * 100;
      margin = Math.round((margin + Number.EPSILON) * 100) / 100;
      let sell = {
        margin,
        profit,
        purchasePrice,
        sellingPrice,
        sold,
        comments
      } as Sell;

      if (item) {
        item.sells?.push(sell);
        this.itemService.updateItem(item); 
      } else {
        let item: Item = {
          itemName: result.item,
          category: result.category,
          profession: result.profession,
          level: result.level,
          sells: [] 
        };
        item.sells?.push(sell);
        this.itemService.addItem(item);
      }
    });
  }

}
