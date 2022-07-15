import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sell } from 'src/app/models/sell';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ItemService } from 'src/app/services/item.service';
import { Validators } from '@angular/forms';
import { Category, Item, Profession } from 'src/app/models/item';
import { ItemStore } from 'src/app/store/item/item.store';

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.scss']
})
export class SellDialogComponent implements OnInit {

  sellForm = this.fb.group({
    item: ['', Validators.required],
    level: ['', Validators.required],
    category: ['', Validators.required],
    profession: ['', Validators.required],
    purchasePrice: ['', Validators.required],
    sellingPrice: ['', Validators.required],
    comments: [''],
    sold: new FormControl(false),
  });

  items: Item[] = [];
  filteredItems: Observable<String[]> | undefined = new Observable<String[]>();

  professions = Profession;
  categories = Category;

  itemAlreadyExists : boolean = true;

  constructor(
    public dialogRef: MatDialogRef<SellDialogComponent>,
    private itemService : ItemService,
    private store: ItemStore,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Sell,
  ) {
    this.store.select('items').subscribe(items => this.items = items);
    this.sellForm.get("item")?.valueChanges.subscribe(itemValue => {
      const item = this.items.find(item => item.itemName == itemValue);
      this.itemAlreadyExists = !!item;
      if (item) {
        this.sellForm.get('level')?.setValue(item.level.toString());
        this.sellForm.get('category')?.setValue(item.category);
        this.sellForm.get('profession')?.setValue(item.profession);
      } else {
        this.sellForm.get('level')?.setValue('');
        this.sellForm.get('category')?.setValue('');
        this.sellForm.get('profession')?.setValue('');
      }
    });
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
    return this.items.map(item => item.itemName).filter(item => item.toLowerCase().includes(filterValue));
  }

}
