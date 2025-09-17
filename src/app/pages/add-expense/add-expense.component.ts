import {Component} from '@angular/core';
import {AlertController, IonicModule, ModalController, NavController, ToastController} from "@ionic/angular";
import {AddExpenseModalComponent} from "../add-expense-modal/add-expense-modal.component";
import {ExpenseCategoryService} from "../../services/expense-category.service";
import {Expense} from "../../models/expense";
import {CommonModule} from "@angular/common";
import {ExpenseDbService} from "../../services/expense.service";
import {ExpenseBeneficiaryService} from "../../services/beneficiary.service";

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  imports: [IonicModule, CommonModule],
  standalone: true,
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {

  categories: {id:number, name:string} [] = [];
  beneficiaries: {id:number, name:string} [] = [];

  expenses: Expense[] = [];

  constructor(
    private modalCtrl: ModalController,
    private _categoriesService: ExpenseCategoryService,
    private _beneficiariesService: ExpenseBeneficiaryService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private _expenseDBService: ExpenseDbService,
    private _toastController: ToastController
  ) {}

  async ionViewWillEnter() {
    try {
      this.categories = await this._categoriesService.getCategoriesList();
      this.beneficiaries = await this._beneficiariesService.fetchAllBeneficiaries();
      console.log(this.beneficiaries);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  async openAddExpenseModal() {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent,
      componentProps: {
        categories: this.categories,
        beneficiaries: this.beneficiaries
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.expenses.push(data as Expense);
      console.log(this.expenses);
    }
  }

  deleteExpense(index: number) {
    this.expenses.splice(index, 1);
  }

  async editExpense(index: number) {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent,
      componentProps: { categories: this.categories, expense: this.expenses[index] }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.expenses[index] = data as Expense;
    }
  }

  async submitAllExpenses() {
    this._expenseDBService.saveExpense(this.expenses)
      .then(() => this._toastController.create({
        message: 'Expenses submitted successfully ✅',
        duration: 2000,
        color: 'success',
        position: 'top'
      }))
      .then((toast) => toast.present())
      .then(() => {
        // clear local state after success
        this.navCtrl.back()
      })
      .catch((err) => {
        // optional: show an error toast
        this._toastController.create({
          message: `Failed to submit expenses: ${err?.message ?? err}`,
          duration: 3000,
          color: 'danger',
          position: 'top'
        }).then(t => t.present());
      });
  }

  async confirmBack() {
    if (this.expenses.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Unsaved Expenses',
        message: 'You have unsaved expenses. Are you sure you want to go back?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Yes', handler: () => this.navCtrl.back() }  // 👈 back navigation
        ]
      });
      await alert.present();
    } else {
      this.navCtrl.back();  // no expenses, just go back
    }
  }
}
