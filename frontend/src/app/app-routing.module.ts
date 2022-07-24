import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';

const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'stats', component: DashboardComponent},
  { path: '', redirectTo: 'history', pathMatch: 'full'},
  { path: '**', redirectTo: 'history'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
