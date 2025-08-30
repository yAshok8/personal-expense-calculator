import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {Expense} from "../../models/expense";
import {ExpenseDbService} from "../../services/expense.service";

@Component({
  selector: 'app-expenses-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css']
})
export class AddExpenseModalComponent implements OnInit {

  @Input() categories: any[] = [];

  constructor(private _modalCtrl: ModalController,
              private _expenseDBService: ExpenseDbService,
              private _toastController: ToastController) {
  }

  minDate: string;
  maxDate: string;
  items: Expense[] = [];
  newItem: Expense = new Expense('', 0, '', '');

  ngOnInit() {
    const today = new Date();
    this.maxDate = today.toISOString(); // today as max

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.minDate = lastMonth.toISOString(); // 1 month before today

    this.newItem.date = today.toISOString()
  }

  addItem() {
    if (this.newItem.itemName
        && this.newItem.amount != null
        && this.newItem.category
        && this.newItem.date) {
      this.newItem.date = this.newItem.date.split('T')[0];
      this.items.push(this.newItem);
      this.newItem = new Expense('', 0, '', '');
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  submitItems() {
    this._expenseDBService.saveExpense(this.items)
      .then(() => this._toastController.create({
        message: 'Expenses submitted successfully ✅',
        duration: 2000,
        color: 'success',
        position: 'top'
      }))
      .then((toast) => toast.present())
      .then(() => {
        // clear local state after success
        this.sendAndDismiss();
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

  sendAndDismiss() {
    this._modalCtrl.dismiss(this.items);
  }

  dismiss() {
    this._modalCtrl.dismiss(null); // cancel
  }
}
