import {Component, Input} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent {

  @Input() categories: {id: number; name: string}[];

  constructor(private _modalCtrl: ModalController) {
  }

  dismiss() {
    this._modalCtrl.dismiss(null); // cancel
  }
}
