import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemStore } from './store/item/item.store';
import { LoadingStore } from './store/loading/loading.store';

import { ItemService } from './services/item.service';
import { HttpApiInterceptor } from './interceptors/http-api.interceptor';

import { HistoryComponent } from './pages/history/history.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';
import { SellDialogComponent } from './components/sell-dialog/sell-dialog.component';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    HistoryComponent,
    HistoryTableComponent,
    SellDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatGridListModule
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
