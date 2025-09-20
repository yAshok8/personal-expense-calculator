import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ExpenseComponent} from "./expense.component";
import {AddEditExpenseModalComponent} from "../add-edit-expense-modal/add-edit-expense-modal.component";
import {ExpensesPageRoutingModule} from "./expense-routing";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensesPageRoutingModule
  ],
  declarations: [
    ExpenseComponent,
    AddEditExpenseModalComponent
  ]
})
export class ExpensesPageModule {}
