import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemStore } from './store/item/item.store';
import { SellStore } from './store/sell/sell.store';
import { LoadingStore } from './store/loading/loading.store';

import { ItemService } from './services/item.service';
import { SellService } from './services/sell.service';
import { StatsService } from './services/stats.service';
import { HttpApiInterceptor } from './interceptors/http-api.interceptor';

import { MaterialModule } from './material-module';

import { HistoryComponent } from './pages/history/history.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';
import { SellDialogComponent } from './components/sell-dialog/sell-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    HistoryComponent,
    HistoryTableComponent,
    SellDialogComponent,
    DeleteDialogComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    LoadingStore,
    ItemStore,
    SellStore,
    ItemService,
    SellService,
    StatsService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: HttpApiInterceptor,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
