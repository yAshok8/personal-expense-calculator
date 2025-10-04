import {Component, OnInit} from '@angular/core';
import {ExpenseDbService} from "../../services/expense.service";
import {Router} from "@angular/router";

interface ExpenseDay {
  date: string;
  spent: number;
  received: number;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {

  expenseDates: ExpenseDay[] = [];
  monthlyTotalSpent: number = 0;
  monthlyTotalReceived: number = 0;
  totalDays: number = 0;
  averageExpensePerDay: number = 0;

  constructor(
    private _expenseDBService: ExpenseDbService,
    private _router: Router
  ) {}

  ngOnInit() {}

  openAddExpenseComponent() {
    this._router.navigate(['/add-expense']);
  }

  async ionViewWillEnter() {
    try {
      this.expenseDates = await this._expenseDBService.getPerDayTotalsForCurrentMonth();
      this.calculateSummary();
    } catch (err) {
      console.error("Error loading expense dates and categories:", err);
    }
  }

  openItems(date: string) {
    this._router.navigate(['/items-list', date]);
  }

  calculateSummary() {
    //todo: This query is executed frequently, check if you can optimize it
    this.monthlyTotalSpent = this.expenseDates
      .reduce((sum, item) => sum + item.spent, 0);
    this.monthlyTotalReceived = this.expenseDates
      .reduce((sum, item) => sum + item.received, 0);
    this.totalDays = this.expenseDates.length;
    this.averageExpensePerDay = this.averagePerDaySpent();
  }

  averagePerDaySpent(): number {
    if (!this.expenseDates.length) return 0;
    const totalSpent = this.expenseDates
      .reduce((sum, d) => sum + (d.spent || 0), 0);
    const dayNumber = new Date().getDate();
    return totalSpent / dayNumber;
  }

}
