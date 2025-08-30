import {Component, OnInit} from '@angular/core';
import {ChartData} from 'chart.js';
import {ExpenseDbService} from "../../services/expense.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Expenses',
        backgroundColor: '#FFCE56'
      }
    ]
  };

  barChartOptions: any = {
    responsive: true,
    indexAxis: 'y', // Horizontal bar
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  constructor(private expenseService: ExpenseDbService) {}

  async ngOnInit() {
    await this.loadCategoryChart();
  }

  async loadCategoryChart() {
    const categoryTotals = await this.expenseService.getCategoryTotalsForMonth(new Date().getFullYear(), new Date().getMonth() + 1);
    this.barChartData.labels = categoryTotals.map(c => c.name);
    this.barChartData.datasets[0].data = categoryTotals.map(c => Number(c.total));
  }
}
