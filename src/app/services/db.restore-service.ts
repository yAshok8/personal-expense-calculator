import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {SQLiteDBConnection} from "@capacitor-community/sqlite";
import {Expense} from "../models/expense";

@Injectable({
  providedIn: 'root',
})
export class DbRestoreService {

  constructor(private _dbService: DatabaseService) {
  }

  async restoreDatabaseFromJson(jsonData: {
    categories: { id: number; name: string }[];
    expense_item: {
      id: number;
      date: string;
      item_name: string;
      amount: number;
      category_id: number;
      created_date: string;
      updated_date: string;
    }[];
  }): Promise<void> {
    await this._dbService.executeQuery(async (db) => {
      // 1️⃣ Clear old data
      await db.execute('DELETE FROM expense_item');
      await db.execute('DELETE FROM categories');

      // 2️⃣ Reset AUTOINCREMENT counters
      await db.execute(`DELETE FROM sqlite_sequence WHERE name='categories'`);
      await db.execute(`DELETE FROM sqlite_sequence WHERE name='expense_item'`);

      // 3️⃣ Insert all categories with original IDs
      for (const cat of jsonData.categories) {
        await db.run(
          `INSERT INTO categories (id, name) VALUES (?, ?)`,
          [cat.id, cat.name]
        );
      }

      // 4️⃣ Insert all expense items with original IDs and timestamps
      for (const item of jsonData.expense_item) {
        await db.run(
          `INSERT INTO expense_item (id, date, item_name, amount, category_id, created_date, updated_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            item.date,
            item.item_name,
            item.amount,
            item.category_id,
            item.created_date,
            item.updated_date
          ]
        );
      }
    });

    console.log('Database restored successfully!');
  }


}
