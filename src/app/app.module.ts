import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ItemStore } from './store/item/item.store';
import { ItemService } from './services/item.service';
import { HttpClientModule } from '@angular/common/http';
import { HistoryComponent } from './pages/history/history.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingStore } from './store/loading/loading.store';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    LoadingStore,
    ItemStore,
    ItemService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
