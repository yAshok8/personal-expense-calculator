import {Component, OnInit} from '@angular/core';
import {ExpenseDbService} from "../../services/expense.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected todayTotalSpentAmount: number = 0;

  constructor(private _expenseService: ExpenseDbService) {}

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit of HomeComponent');
    const today = new Date().toISOString().split('T')[0];
    this.todayTotalSpentAmount = await this._expenseService.getExpenseTotalAmount(today);
  }
}
