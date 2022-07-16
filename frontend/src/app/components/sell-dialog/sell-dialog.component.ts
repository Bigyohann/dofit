import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { Item } from 'src/app/models/item';
import { Sell, SellItem } from 'src/app/models/sell';
import { Category, Profession, ProfessionAndCategoryMap } from 'src/app/models/enums';
import { ItemStore } from 'src/app/store/item/item.store';

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.scss']
})
export class SellDialogComponent implements OnInit {

  sellForm = this.fb.group({
    item: ['', Validators.required],
    item_id: [''],
    level: ['', Validators.required],
    category: ['', Validators.required],
    profession: ['', Validators.required],
    purchasePrice: ['', Validators.required],
    sellingPrice: ['', Validators.required],
    comments: [''],
    sold: new FormControl(false),
  });

  mode: "edit" | "add";

  items: Item[] = [];
  filteredItems: Observable<String[]> | undefined = new Observable<String[]>();

  professions = Profession;
  categories = Category;
  professionAndCategoryMap = ProfessionAndCategoryMap;

  filteredProfessions = Object.values(this.professions);
  filteredCategories = Object.values(this.categories);

  itemAlreadyExists : boolean = true;

  constructor(
    public dialogRef: MatDialogRef<SellDialogComponent>,
    private store: ItemStore,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: SellItem,
  ) {
    if(Object.keys(data).length !== 0) {
      this.mode = "edit";
      this.applyObjectToForm();
    } else {
      this.mode = 'add';
    }

    this.store.select('items').subscribe(items => {
      this.items = items
      this.sellForm.get("item_id")?.setValue(data.item_id);
    });
    this.sellForm.get("item")?.valueChanges.subscribe(itemValue => {
      const item = this.items.find(item => item.itemName == itemValue);
      this.itemAlreadyExists = !!item;
      if (item) {
        this.sellForm.get('item_id')?.setValue(item.id);
        this.sellForm.get('level')?.setValue(item.level.toString());
        this.sellForm.get('category')?.setValue(item.category);
        this.sellForm.get('profession')?.setValue(item.profession);
      } else {
        this.sellForm.get('item_id')?.setValue('');
        this.sellForm.get('level')?.setValue('');
        this.sellForm.get('category')?.setValue('');
        this.sellForm.get('profession')?.setValue('');
      }
    });
    this.sellForm.get("category")?.valueChanges.subscribe(selectedCategory => {
      if (selectedCategory) {
        let profession = Array.from(this.professionAndCategoryMap.keys()).find(key => this.professionAndCategoryMap.get(key)?.includes(selectedCategory));
        if (profession) this.sellForm.get('profession')?.setValue(profession);
      }
    });
  }

  applyObjectToForm(){
    this.sellForm.get('item')?.setValue(this.data.item?.itemName || '');
    this.sellForm.get('item_id')?.setValue(this.data.item_id);
    this.sellForm.get('level')?.setValue(this.data.item?.level.toString() || '');
    this.sellForm.get('category')?.setValue(this.data.item?.category || '');
    this.sellForm.get('profession')?.setValue(this.data.item?.profession || '');
    this.sellForm.get('purchasePrice')?.setValue(this.data.purchasePrice.toString());
    this.sellForm.get('sellingPrice')?.setValue(this.data.sellingPrice.toString());
    this.sellForm.get('comments')?.setValue(this.data.comments || '');
    this.sellForm.get('sold')?.setValue(this.data.sold);
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
