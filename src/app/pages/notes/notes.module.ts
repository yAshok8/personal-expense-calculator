import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {NotesComponent} from "./notes.component";
import {NotesRoutingModule} from "./notes-routing.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [NotesComponent],
  imports: [
    CommonModule,
    IonicModule,
    NotesRoutingModule,
    FormsModule
  ]
})
export class NotesModule {}
