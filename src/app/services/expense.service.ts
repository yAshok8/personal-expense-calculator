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

  async getLatestTransactions(): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT e.id,
                e.item_name,
                e.amount,
                e.date,
                c.id AS category_id,
                c.name AS category_name
         FROM expense_item e
                JOIN categories c ON e.category_id = c.id
         ORDER BY e.created_date DESC LIMIT 5`
      );

      return (result.values || []).map(row =>
        new Expense(
          row.item_name,
          row.amount,
          {id: row.category_id, name: row.category_name},
          row.date
        )
      );
    });
  }

  async getExpenseTotalAmount(day: string): Promise<number> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT SUM(amount) as total
         FROM expense_item
         WHERE date = ?`,
        [day]
      );
      return result.values?.[0]?.total ?? 0;
    });
  }

  async getExpensesForDay(day: string): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT e.id, e.item_name, e.amount, e.date, c.id AS category_id, c.name AS category_name
         FROM expense_item e
                JOIN categories c ON e.category_id = c.id
         WHERE e.date = ?`,
        [day]
      );

      // Map DB rows to Expense instances
      return (result.values || []).map(row =>
        new Expense(
          row.item_name,
          row.amount,
          {id: row.category_id, name: row.category_name},
          row.date
        )
      );
    });
  }

  async getExpenseTotalsByDate() {
    console.log('loading day wise expenses');
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`
        SELECT date, SUM (amount) AS total
        FROM expense_item
        GROUP BY date
        ORDER BY date DESC
      `);
      return result.values || [];
    });
  }

  async saveExpense(items: Expense[]): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      for (const item of items) {
        await db.run(
          `INSERT INTO expense_item ("date", item_name, amount, category_id)
           VALUES (?, ?, ?, ?)`,
          [item.date.trim(), item.itemName.trim(), item.amount, item.category]
        );
      }
    });
  }
}
