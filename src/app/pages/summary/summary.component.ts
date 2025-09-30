import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ExpenseDbService } from '../../services/expense.service';

Chart.register(...registerables);

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  selectedMonth: Date = new Date();
  totalSpent = 0;
  totalReceived = 0;
  finalExpense = 0;
  topCategory = '';
  topBeneficiary = '';
  categoryChart: any;
  beneficiaryChart: any;
  months: Date[] = [];

  @ViewChild('categoryChartCanvas', { static: false }) categoryChartCanvas!: ElementRef;

  @ViewChild('beneficiaryChartCanvas', { static: false }) beneficiaryChartCanvas!: ElementRef;

  constructor(private expenseDb: ExpenseDbService) {}

  async ngOnInit() {
    const { minDate, maxDate } = await this.expenseDb.getDateRange();

    const min = new Date(minDate);
    const max = new Date(maxDate);

    this.months = [];
    let d = new Date(max.getFullYear(), max.getMonth(), 1);

    while (d >= new Date(min.getFullYear(), min.getMonth(), 1)) {
      this.months.push(new Date(d));
      d.setMonth(d.getMonth() - 1); // step back one month
    }

    // Default = latest available month
    this.selectedMonth = new Date(max.getFullYear(), max.getMonth(), 1);

    this.loadSummary();
  }
  async confirmBack() {
    console.log('back btn pressed');
  }

  async loadSummary() {
    const year = this.selectedMonth.getFullYear().toString();
    const month = (this.selectedMonth.getMonth() + 1).toString().padStart(2, '0');

    this.totalSpent = await this.expenseDb.getTotalSpent(year, month);
    this.totalReceived = await this.expenseDb.getTotalReceived(year, month);
    this.finalExpense = this.totalSpent - this.totalReceived;

    this.topCategory = await this.expenseDb.getTopCategory(year, month);
    this.topBeneficiary = await this.expenseDb.getTopBeneficiary(year, month);

    const categoryData = await this.expenseDb.getCategoryBreakdown(year, month);
    const beneficiaryData = await this.expenseDb.getBeneficiaryBreakdown(year, month);

    this.renderCategoryChart(categoryData);
    this.renderBeneficiaryChart(beneficiaryData);
  }

  renderCategoryChart(data: any[]) {
    if (this.categoryChart) this.categoryChart.destroy();

    this.categoryChart = new Chart(this.categoryChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map(d => d.category),
        datasets: [
          {
            data: data.map(d => d.total),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
          }
        ]
      }
    });
  }

  renderBeneficiaryChart(data: any[]) {
    if (this.beneficiaryChart) this.beneficiaryChart.destroy();

    this.beneficiaryChart = new Chart(this.beneficiaryChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.beneficiary),
        datasets: [
          {
            label: 'Amount Spent',
            data: data.map(d => d.total),
            backgroundColor: '#42A5F5'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
