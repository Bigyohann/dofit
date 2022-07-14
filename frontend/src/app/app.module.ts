import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { ItemStore } from './store/item/item.store';
import { LoadingStore } from './store/loading/loading.store';

import { ItemService } from './services/item.service';

import { HistoryComponent } from './pages/history/history.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    HistoryComponent,
    HistoryTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule
  ],
  providers: [
    LoadingStore,
    ItemStore,
    ItemService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
