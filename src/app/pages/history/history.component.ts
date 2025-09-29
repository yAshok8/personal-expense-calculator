import { Component } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { ExpenseDbService } from "../../services/expense.service";
import {Expense} from "../../models/expense";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  expenses: Expense[] = [];
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  hasMore = true;
  loading = false;

  constructor(private expenseDBService: ExpenseDbService) {}

  async ionViewWillEnter() {
    this.currentPage = 1;
    this.expenses = [];
    await this.loadPage(this.currentPage);
  }

  async loadPage(page: number, event?: any) {
    if (this.loading) return;
    this.loading = true;

    const [newExpenses, total] = await Promise.all([
      this.expenseDBService.getExpenseItemsPaginated(page, this.pageSize),
      this.expenseDBService.getTotalExpenseCount()
    ]);

    this.totalCount = total;
    this.expenses = [...this.expenses, ...newExpenses];
    this.currentPage = page;
    this.hasMore = this.currentPage * this.pageSize < this.totalCount;

    this.loading = false;
    if (event) event.target.complete();
  }

  async loadMore(event: any) {
    await this.loadPage(this.currentPage + 1, event);
  }
}
