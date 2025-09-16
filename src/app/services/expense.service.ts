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


  async getAllExpenseItems(): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT * FROM expense_item ORDER BY id ASC`);
      return result.values || [];
    });
  }

  async getLatestTransactions(): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT e.id,
                e.item_name,
                e.amount,
                e.date,
                c.id AS category_id,
                c.name AS category_name,
                b.id as beneficiary_id,
                b.name AS beneficiary_name
         FROM expense_item e
                JOIN categories c ON e.category_id = c.id
                JOIN beneficiaries b on e.beneficiary_id = b.id
         ORDER BY e.created_date DESC LIMIT 5`
      );

      return (result.values || []).map(row =>
        new Expense(
          row.item_name,
          row.amount,
          {id: row.category_id, name: row.category_name},
          row.date,
          row.spent,
          {id: row.beneficiary_id, name: row.beneficiary_name}
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

  async getExpensesForDate(day: string): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
      `SELECT
                        e.id,
                        e.item_name,
                        e.amount,
                        e.date,
                        c.id AS category_id,
                        c.name AS category_name,
                        b.id as beneficiary_id,
                        b.name AS beneficiary_name
               FROM expense_item e
                    JOIN categories c ON e.category_id = c.id
                    JOIN beneficiaries b on e.beneficiary_id = b.id
               WHERE e.date = ?`,
                [day]
      );

      // Map DB rows to Expense instances
      return (result.values || []).map(row => {
          const newExpense = new Expense(
            row.item_name,
            row.amount,
            {id: row.category_id, name: row.category_name},
            row.date,
            row.spent,
            {id: row.beneficiary_id, name: row.beneficiary_name}
          );
          newExpense.id = row.id;
          return newExpense;
        }
      );
    });
  }

  async getExpenseTotalsByDateCurrentMonth() {
    const today = new Date();
    const yearMonth = today.toISOString().slice(0, 7); // "YYYY-MM"

    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`
      SELECT date, SUM(amount) AS total
      FROM expense_item
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY date
      ORDER BY date DESC
    `, [yearMonth]);
      return result.values || [];
    });
  }


  async saveExpense(items: Expense[]): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      for (const item of items) {
        console.log(item);
        await db.run(
          `INSERT INTO expense_item ("date", item_name, amount, category_id)
           VALUES (?, ?, ?, ?)`,
          [item.date.trim(), item.itemName.trim(), item.amount, item.category.id]
        );
      }
    });
  }

  async deleteExpense(id: number): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      await db.run(
        `DELETE FROM expense_item WHERE id = ?`,
        [id]
      );
      console.log(`Expense successfully deleted.`);
    });
  }

}
