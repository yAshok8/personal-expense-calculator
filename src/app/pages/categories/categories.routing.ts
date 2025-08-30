import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoriesComponent} from "./categories.component";
import {IonicModule} from "@ionic/angular";

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
