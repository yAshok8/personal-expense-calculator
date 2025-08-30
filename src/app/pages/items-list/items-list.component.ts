import { Expense } from "../../models/expense";
import { Component, OnInit } from "@angular/core";
import { ExpenseDbService } from "../../services/expense.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  items: Expense[] = [];
  date: string = '';
  totalForDay: number = 0;

  constructor(
    private expenseService: ExpenseDbService,
    private router: ActivatedRoute
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    this.date = this.router.snapshot.params['date'] || '';
    if (this.date) {
      this.items = await this.expenseService.getExpensesForDay(this.date);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.totalForDay = this.items.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  // Map categories to icons
  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'food': return 'fast-food-outline';
      case 'travel': return 'car-outline';
      case 'shopping': return 'cart-outline';
      case 'bills': return 'home-outline';
      case 'entertainment': return 'film-outline';
      default: return 'cash-outline';
    }
  }
}
