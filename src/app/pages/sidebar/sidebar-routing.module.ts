
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IonicModule} from "@ionic/angular";
import {SidebarPage} from "./sidebar.component";


const routes: Routes = [
  {
    path: '',
    component: SidebarPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule]
})
export class SidebarRoutingModule {}

