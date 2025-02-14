import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./components/account/account.module').then(m => m.AccountModule)
  },
  { path: '', redirectTo: 'account/create', pathMatch: 'full' },
  { path: '**', redirectTo: 'account/create' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
