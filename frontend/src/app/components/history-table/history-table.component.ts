import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from 'src/app/models/item';
import { Sell, SellItem } from 'src/app/models/sell';
import { ItemService } from 'src/app/services/item.service';
import { SellDialogComponent } from '../sell-dialog/sell-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators'
import { SellService } from 'src/app/services/sell.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
  items!: Item[] | null;

  @Input()
  sells!: Sell[] | null;

  sellItems!: SellItem[];

  dataSource!: MatTableDataSource<SellItem>; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  columnsToDisplay = ['name', 'purchase-price', 'selling-price', 'profit', 'margin', 'sold'];
  columnsToDisplayWithActions = [...this.columnsToDisplay, 'expand'];

  expandedElement: Sell | null = null;
  hoverEdit = false;
  hoverDelete = false;

  constructor(
    private itemService: ItemService,
    private sellService: SellService,
    public dialog: MatDialog,
  ) {}

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
    if (!!this.items && !!this.sells){
      this.sellItems = this.sellService.generateSellsWithItems(this.items, this.sells);
      this.dataSource = new MatTableDataSource<SellItem>(this.sellItems);
      console.log(this.sells);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (row:SellItem, columnName:string) : string | number => {
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
      let item: Item | undefined = this.items?.find(item => item.id === result?.item_id);

      // Sell
      const item_id = result.item_id
      const sold = result.sold
      const comments = result.comments
      const purchasePrice = Number(result.purchasePrice); 
      const sellingPrice = Number(result.sellingPrice); 
      const profit = sellingPrice - purchasePrice;
      const margin = Math.round((profit / purchasePrice * 100 + Number.EPSILON) * 100) / 100;
      
      if (!item) {
        const itemName = result.item
        const level = result.level
        const category = result.category
        const profession = result.profession

        let item = {
          itemName,
          level,
          category,
          profession
        } as Item

        this.itemService.addItem(item).subscribe(item => {
          if (item) {
            this.itemService.init()
            let item_id = item.id;
            let sell = {
              item_id,
              margin,
              profit,
              purchasePrice,
              sellingPrice,
              sold,
              comments
            } as Sell;
            
            this.sellService.addSell(sell);
            this.sellService.init();
          }
        }); 
      } else {
        let sell = {
          item_id,
          margin,
          profit,
          purchasePrice,
          sellingPrice,
          sold,
          comments
        } as Sell;
        
        this.sellService.addSell(sell);
        this.sellService.init();
      }
    });
  }

  openEditSellDialog(sellItem: SellItem): void {
    const dialogRef = this.dialog.open(SellDialogComponent, {
      width: '500px',
      data: {
        ...sellItem
      } as SellItem,
    });

    dialogRef.afterClosed().pipe(filter(res => !!res)).subscribe((result) => {
      let item: Item | undefined = this.items?.find(item => item.id === result?.item_id);

      // Sell
      const id = sellItem.id;
      const item_id = result.item_id
      const sold = result.sold
      const comments = result.comments
      const purchasePrice = Number(result.purchasePrice); 
      const sellingPrice = Number(result.sellingPrice); 
      const profit = sellingPrice - purchasePrice;
      const margin = Math.round((profit / purchasePrice * 100 + Number.EPSILON) * 100) / 100;

      if (!item) {
        const itemName = result.item
        const level = result.level
        const category = result.category
        const profession = result.profession

        let item = {
          itemName,
          level,
          category,
          profession
        } as Item

        this.itemService.addItem(item).subscribe(item => {
          if (item) {
            this.itemService.init()
            let item_id = item.id;
            let sell = {
              id,
              item_id,
              margin,
              profit,
              purchasePrice,
              sellingPrice,
              sold,
              comments
            } as Sell;
            
            this.sellService.updateSell(sell);
          }
        }); 
      } else {
        let sell = {
          id,
          item_id,
          margin,
          profit,
          purchasePrice,
          sellingPrice,
          sold,
          comments
        } as Sell;
        
        this.sellService.updateSell(sell);
      }
    });
  }

  openDeleteDialog(sellItem: SellItem): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {...sellItem},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('delete ? ', result);
      if (result) {
        this.sellService.deleteSell(sellItem);
      }
    });
  }
}
