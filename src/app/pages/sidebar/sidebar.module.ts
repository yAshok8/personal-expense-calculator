import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SidebarPage} from "./sidebar.component";
import {SidebarRoutingModule} from "./sidebar-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SidebarRoutingModule
  ],
  exports: [
    SidebarPage
  ],
  declarations: [SidebarPage]
})
export class SidebarPageModule {}
