import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ItemStore } from './store/item/item.store';
import { LoadingStore } from './store/loading/loading.store';

import { ItemService } from './services/item.service';
import { HttpApiInterceptor } from './interceptors/http-api.interceptor';

import { HistoryComponent } from './pages/history/history.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    LoadingStore,
    ItemStore,
    ItemService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: HttpApiInterceptor,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
