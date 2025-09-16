import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Expense} from "../../models/expense";

@Component({
  selector: 'app-expenses-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css']
})
export class AddExpenseModalComponent implements OnInit {

  @Input() categories: {id: number; name: string}[];
  @Input() expense?: Expense;

  itemName: string = '';
  amount: number = 0;
  categoryId: number | null = null;
  date: string = new Date().toISOString().split('T')[0];

  constructor(private _modalCtrl: ModalController){}

  ngOnInit() {
    if (this.expense) {
      this.itemName = this.expense.itemName;
      this.amount = this.expense.amount;
      this.categoryId = this.expense.category.id;
      this.date = this.expense.date;
    }
  }

  addExpense() {
    if (!this.itemName || !this.amount || !this.categoryId || !this.date) {
      return;
    }

    const category = this.categories.find(c => c.id === this.categoryId)!;
    const newExpense = new Expense(this.itemName, this.amount, category, this.date);

    this._modalCtrl.dismiss(newExpense);
  }

  dismiss() {
    this._modalCtrl.dismiss(null); // cancel
  }

}
