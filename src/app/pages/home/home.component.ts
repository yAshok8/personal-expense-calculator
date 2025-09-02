import {Component, OnInit} from '@angular/core';
import {ExpenseDbService} from "../../services/expense.service";
import {ExpenseCategoryService} from "../../services/expense-category.service";
import {Expense} from "../../models/expense";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected todayTotalSpentAmount: number = 0;
  protected categoryTotals: { id: number; name: string; total: number }[] = [];
  latestTransactions: Expense[] = [];


  constructor(
    private _expenseService: ExpenseDbService,
    private _categoryService: ExpenseCategoryService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit of HomeComponent');
    const today = new Date();
    const today_str = today.toISOString().split('T')[0];
    this.todayTotalSpentAmount = await this._expenseService.getExpenseTotalAmount(today_str);

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    this.categoryTotals = await this._categoryService.getCategoryTotalsForMonth(year, month);
    this.latestTransactions = await this._expenseService.getLatestTransactions();
  }

  getCategoryIcon(name: string): string {
    switch (name.toLowerCase()) {
      case 'food': return 'fast-food-outline';
      case 'transport': return 'car';
      case 'bills': return 'home-outline';
      case 'leisure': return 'wine';
      default: return 'pricetag-outline';
    }
  }

}
