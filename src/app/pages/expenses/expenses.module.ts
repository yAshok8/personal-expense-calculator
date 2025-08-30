import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AddExpenseComponent} from "./add-expense.component";
import {AddExpenseModalComponent} from "../add-expense-modal/add-expense-modal.component";
import {ExpensesPageRoutingModule} from "./expense-routing";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensesPageRoutingModule
  ],
  declarations: [
    AddExpenseComponent,
    AddExpenseModalComponent
  ]
})
export class ExpensesPageModule {}
