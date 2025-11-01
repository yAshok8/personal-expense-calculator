import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-beneficiary-expense-popover',
  templateUrl: './beneficiary-popover.component.html',
  styleUrls: ['./beneficiaries.component.css']
})
export class BeneficiaryPopoverComponent implements OnInit {
  @Input() beneficiaryId!: number;
  beneficiaryExpenses: any[] = [];

  constructor(
    private _dbService: DatabaseService,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    await this.loadExpenses();
  }

  async loadExpenses() {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    const query = `
      SELECT e.item_name, e.amount, e.date
      FROM expense_item e
      WHERE e.beneficiary_id = ?
        AND e.spent = 1
        AND strftime('%Y', e.date) = ?
        AND strftime('%m', e.date) = ?
      ORDER BY e.date DESC
    `;
    const result = await this._dbService.executeQuery(async (db) => {
      const res = await db.query(query, [this.beneficiaryId, year, month]);
      return res.values || [];
    });

    this.beneficiaryExpenses = result;
  }

  async close() {
    try {
      await this.popoverController.dismiss();
    } catch (e) {
      console.warn('Popover not present:', e);
    }
  }

}
