import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { HomeComponent } from "../home/home.component";
import { ProfileComponent } from "../profile/profile.component";
import {AddExpenseComponent} from "../add-expense/add-expense.component";

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'add-expense',
        component: AddExpenseComponent
      },
      {
        path: 'expenses',
        loadChildren: () =>
          import('../expenses/expenses.module').then(m => m.ExpensesPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
      {
        path: 'items-list/:date',
        loadChildren: () =>
          import('../items-list/items-list.module').then(m => m.ItemsListModule),
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../categories/categories.module').then(m => m.CategoriesModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
