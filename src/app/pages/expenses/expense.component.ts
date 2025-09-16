import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { Expense } from "../../models/expense";
import { AddExpenseModalComponent } from "../add-expense-modal/add-expense-modal.component";
import { ExpenseDbService } from "../../services/expense.service";
import { ExpenseCategoryService } from "../../services/expense-category.service";
import { Router } from "@angular/router";

interface ExpenseDay {
  date: string;
  total: number;
  trend?: 'up' | 'down' | 'equal';
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {

  expenseDates: ExpenseDay[] = [];
  categories: {id:number, name:string} [] = [];

  // New fields
  monthlyTotal: number = 0;
  totalDays: number = 0;

  constructor(
    private _expenseDBService: ExpenseDbService,
    private modalCtrl: ModalController,
    private _categoriesService: ExpenseCategoryService,
    private _router: Router
  ) {}

  ngOnInit() {}

  openAddExpenseComponent() {
    this._router.navigate(['/add-expense']);
  }

  async ionViewWillEnter() {
    try {
      this.expenseDates = await this._expenseDBService.getExpenseTotalsByDateCurrentMonth();
      this.categories = await this._categoriesService.getCategoriesList();
      this.calculateSummary();
      this.calculateTrends();
    } catch (err) {
      console.error("Error loading expense dates and categories:", err);
    }
  }

  openItems(date: string) {
    this._router.navigate(['/items-list', date]);
  }

  async openAddExpenseModal() {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent,
      componentProps: { categories: this.categories },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.expenseDates = await this._expenseDBService.getExpenseTotalsByDateCurrentMonth();
      this.calculateSummary();
      this.calculateTrends();
    }
  }


  calculateSummary() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.monthlyTotal = this.expenseDates
      .filter(item => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + item.total, 0);

    this.totalDays = this.expenseDates.length;
  }

  calculateTrends() {
    this.expenseDates.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (let i = 1; i < this.expenseDates.length; i++) {
      const prev = this.expenseDates[i - 1];
      const curr = this.expenseDates[i];

      if (curr.total > prev.total) {
        curr.trend = 'up';
      } else if (curr.total < prev.total) {
        curr.trend = 'down';
      } else {
        curr.trend = 'equal';
      }
    }
  }
}
