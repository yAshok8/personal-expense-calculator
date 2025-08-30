import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {SQLiteDBConnection} from "@capacitor-community/sqlite";
import {Expense} from "../models/expense";

@Injectable({
  providedIn: 'root',
})
export class ExpenseDbService {

  constructor(private _dbService: DatabaseService) {
  }

  async getExpenseTotalAmount(day: string): Promise<number> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT SUM(amount) as total FROM expense_item WHERE date = ?`,
        [day]
      );
      return result.values?.[0]?.total ?? 0;
    });
  }

  async getExpensesForDay(day: string): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`
      SELECT * from expense_item where date = ?
    `, [day]);
      return result.values || [];
    });
  }

  async getExpenseTotalsByDate() {
    console.log('loading day wise expenses');
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`
      SELECT date, SUM(amount) AS total
      FROM expense_item
      GROUP BY date
      ORDER BY date DESC
    `);
      return result.values || [];
    });
  }

  async saveExpense(
    items: Expense[]
  ): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      // Insert items
      for (const item of items) {
        const categoryName = item.category?.trim();
        await db.run(
          `INSERT INTO expense_item ("date", item_name, amount, category) VALUES (?, ?, ?, ?)`,
          [item.date.trim(), item.itemName.trim(), item.amount, categoryName]
        );
      }
    });
  }


}
