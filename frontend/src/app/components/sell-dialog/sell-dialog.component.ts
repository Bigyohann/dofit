import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sell } from 'src/app/models/sell';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ItemService } from 'src/app/services/item.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.scss']
})
export class SellDialogComponent implements OnInit {

  sellForm = this.fb.group({
    item: ['', Validators.required],
    comments: [''],
    purchasePrice: ['', Validators.required],
    sellingPrice: ['', Validators.required],
    sold: new FormControl(false),
  });
  items: String[] = [];
  filteredItems: Observable<String[]> | undefined = new Observable<String[]>();

  constructor(
    public dialogRef: MatDialogRef<SellDialogComponent>,
    private itemService : ItemService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Sell,
  ) {
    this.items = this.itemService.getAllItemsNames();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.filteredItems = this.sellForm.get("item")?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: String): String[] {
    const filterValue = value.toLowerCase();
    return this.items.filter(item => item.toLowerCase().includes(filterValue));
  }

}
