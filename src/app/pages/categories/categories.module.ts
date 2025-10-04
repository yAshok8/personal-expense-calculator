import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {CategoriesRoutingModule} from "./categories.routing";
import {CategoriesComponent} from "./categories.component";
import {NgChartsModule} from "ng2-charts";
import {AddCategoryModalComponent} from "../add-category-modal/add-category-modal.component";
import {CategoryExpensePopoverComponent} from "./expense-category.popover.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesRoutingModule,
    NgChartsModule
  ],
  declarations: [
    CategoriesComponent,
    AddCategoryModalComponent,
    CategoryExpensePopoverComponent
  ]
})
export class CategoriesModule {}
