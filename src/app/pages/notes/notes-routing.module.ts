import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IonicModule} from "@ionic/angular";
import {NotesComponent} from "./notes.component";

const routes: Routes = [
  {
    path: '',
    component: NotesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule]
})
export class NotesRoutingModule {}
