import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExpenseDbService } from '../../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  selectedMonth: Date = new Date();
  totalSpent = 0;
  totalReceived = 0;
  finalExpense = 0;
  topCategory = '';
  topBeneficiary = '';
  months: Date[] = [];

  constructor(
    private expenseDb: ExpenseDbService,
    private router: Router
  ) {}

  async ngOnInit() {
    const { minDate, maxDate } = await this.expenseDb.getDateRange();
    this.buildMonths(new Date(minDate), new Date(maxDate));
    this.selectedMonth = this.months[0];
    await this.loadSummary();
  }

  confirmBack() {
    this.router.navigate(['/tabs/home']);
  }

  private buildMonths(min: Date, max: Date) {
    this.months = [];
    let d = new Date(max.getFullYear(), max.getMonth(), 1);
    const minStart = new Date(min.getFullYear(), min.getMonth(), 1);

    while (d >= minStart) {
      this.months.push(new Date(d));
      d.setMonth(d.getMonth() - 1);
    }
  }

  async loadSummary() {
    const year = this.selectedMonth.getFullYear().toString();
    const month = (this.selectedMonth.getMonth() + 1).toString().padStart(2, '0');

    // fetch in parallel
    const [
      spent,
      received,
      category,
      beneficiary
    ] = await Promise.all([
      this.expenseDb.getTotalSpent(year, month),
      this.expenseDb.getTotalReceived(year, month),
      this.expenseDb.getTopCategory(year, month),
      this.expenseDb.getTopBeneficiary(year, month)
    ]);

    this.totalSpent = spent || 0;
    this.totalReceived = received || 0;
    this.finalExpense = this.totalSpent - this.totalReceived;

    this.topCategory = category
      ? `${category.name} - ${Number(category.total).toFixed(2)} SR`
      : 'N/A';

    this.topBeneficiary = beneficiary
      ? `${beneficiary.name} - ${Number(beneficiary.total).toFixed(2)} SR`
      : 'N/A';

  }
}
