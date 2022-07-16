import { Component } from '@angular/core';
import { ItemService } from './services/item.service';
import { SellService } from './services/sell.service';
import { LoadingStore } from './store/loading/loading.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  loading$ = this.store.select('loading');
  
  constructor(
    private itemService: ItemService,
    private sellService: SellService,
    private store: LoadingStore
  ) {
    this.itemService.init();
    this.sellService.init();
  }
}
