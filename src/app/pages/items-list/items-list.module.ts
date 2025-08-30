import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {ItemsListComponent} from "./items-list.component";
import {ItemListRoutingModule} from "./item-list-routing";

@NgModule({
  declarations: [ItemsListComponent],
  imports: [
    CommonModule,
    IonicModule,
    ItemListRoutingModule
  ]
})
export class ItemsListModule {}
