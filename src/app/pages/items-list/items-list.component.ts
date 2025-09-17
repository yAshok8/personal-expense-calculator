import { Expense } from "../../models/expense";
import { Component, OnInit } from "@angular/core";
import { ExpenseDbService } from "../../services/expense.service";
import { ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";

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
    private expenseDBService: ExpenseDbService,
    private router: ActivatedRoute,
    private alertController: AlertController
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    this.date = this.router.snapshot.params['date'] || '';
    if (this.date) {
      this.items = await this.expenseDBService.getExpensesForDate(this.date);
      console.log(this.items);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    console.log("calculating total");
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

  async edit(item: Expense) {
    console.log(item);
  }

  async confirmDelete(item: Expense) {
    const alert = await this.alertController.create({
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
