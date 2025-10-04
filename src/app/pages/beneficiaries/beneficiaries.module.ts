import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {BeneficiariesComponent} from "./beneficiaries.component";
import {BeneficiariesRouting} from "./beneficiaries-routing";
import {NgChartsModule} from "ng2-charts";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiariesRouting,
    NgChartsModule
  ],
  declarations: [
    BeneficiariesComponent
  ]
})
export class BeneficiariesModule {}
