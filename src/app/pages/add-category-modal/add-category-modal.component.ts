import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExpenseCategoryService } from "../../services/expense-category.service";

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent {

  categoryName: string = '';

  constructor(
    private modalController: ModalController,
    private _categoriesService: ExpenseCategoryService
  ) {}

  async addCategory() {
    if (!this.categoryName.trim()) return;

    try {
      await this._categoriesService.addCategory({ name: this.categoryName });
      this.modalController.dismiss({ refresh: true });
    } catch (err) {
      console.error('Error adding category:', err);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
