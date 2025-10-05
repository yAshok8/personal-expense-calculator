import {Expense} from "../../models/expense";
import {Component, OnInit} from "@angular/core";
import {ExpenseDbService} from "../../services/expense.service";
import {ActivatedRoute} from "@angular/router";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {ExpenseCategoryService} from "../../services/expense-category.service";
import {ExpenseBeneficiaryService} from "../../services/beneficiary.service";
import {AddEditExpenseModalComponent} from "../add-edit-expense-modal/add-edit-expense-modal.component";

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  items: Expense[] = [];
  date: string = '';
  totalForDay: number = 0;
  categories: {id:number, name:string} [] = [];
  beneficiaries: {id:number, name:string} [] = [];


  constructor(
    private expenseDBService: ExpenseDbService,
    private router: ActivatedRoute,
    private _alertController: AlertController,
    private _categoriesService: ExpenseCategoryService,
    private _beneficiariesService: ExpenseBeneficiaryService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    this.date = this.router.snapshot.params['date'] || '';
    this.categories = await this._categoriesService.getCategoriesList();
    this.beneficiaries = await this._beneficiariesService.fetchAllBeneficiaries();
    if (this.date) {
      this.items = await this.expenseDBService.getExpensesForDate(this.date);
      console.log(this.items);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.totalForDay = this.items.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  async edit(expense: Expense) {
    console.log(expense);
    const modal = await this.modalController.create({
      component: AddEditExpenseModalComponent,
      componentProps: {
        categories: this.categories,
        beneficiaries: this.beneficiaries,
        expense: expense
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      await this.expenseDBService.updateExpense(data);
      const index = this.items.findIndex(i => i.id === data.id);
      if (index > -1) {
        this.items[index] = data;
        this.calculateTotal();
      }
      const toast = await this.toastController.create({
        message: 'Expense updated successfully.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    }
  }

  async confirmDelete(item: Expense) {
    const alert = await this._alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${item.itemName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.expenseDBService.deleteExpense(item.id!);
            this.items = this.items.filter(i => i.id !== item.id);
            this.calculateTotal();
          }
        }
      ]
    });
    await alert.present();
  }

}
