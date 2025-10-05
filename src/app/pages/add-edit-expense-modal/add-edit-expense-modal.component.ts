import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Expense} from "../../models/expense";

@Component({
  selector: 'app-expenses-modal',
  templateUrl: './add-edit-expense-modal.component.html',
  styleUrls: ['./add-edit-expense-modal.component.css']
})
export class AddEditExpenseModalComponent implements OnInit {

  @Input() categories: {id: number; name: string}[];
  @Input() beneficiaries: {id: number; name: string}[];
  @Input() expense?: Expense;

  constructor(private _modalCtrl: ModalController){}

  ngOnInit() {
    if (!this.expense) {
      const date: string = new Date().toISOString().split('T')[0];
      this.expense = new Expense('', 0, {id: null, name: ''}, date, true, {id: null, name: ''});
    }
  }

  compareCategory = (c1: any, c2: any) => {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  };

  compareBeneficiary = (b1: any, b2: any) => {
    return b1 && b2 ? b1.id === b2.id : b1 === b2;
  };


  addExpense() {
    if (!this.expense.itemName ||
        !this.expense.amount ||
        !this.expense.category.id ||
        !this.expense.beneficiary.id
        || !this.expense.date) {
      return;
    }
    this._modalCtrl.dismiss(this.expense);
  }

  dismiss() {
    this._modalCtrl.dismiss(null);
  }

}
