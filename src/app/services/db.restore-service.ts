import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root',
})
export class DbRestoreService {

  constructor(private _dbService: DatabaseService) {
  }

  async restoreDatabaseFromJson(jsonData: {
    categories: { id: number; name: string }[];
    beneficiaries: { id: number; name: string }[];
    expense_item: {
      id: number;
      date: string;
      item_name: string;
      amount: number;
      category_id: number;
      beneficiary_id: number;
      spent: number;
      created_date: string;
      updated_date: string;
    }[];
    notes: {
      id: number;
      date: string;
      name: string;
      created_at: string;
      updated_at: string;
    }[];
  }): Promise<void> {
    await this._dbService.executeQuery(async (db) => {
      await db.execute('DELETE FROM expense_item');
      await db.execute('DELETE FROM categories');
      await db.execute('DELETE FROM beneficiaries');
      await db.execute('DELETE FROM notes');

      await db.execute(`DELETE FROM sqlite_sequence WHERE name='categories'`);
      await db.execute(`DELETE FROM sqlite_sequence WHERE name='beneficiaries'`);
      await db.execute(`DELETE FROM sqlite_sequence WHERE name='expense_item'`);
      await db.execute(`DELETE FROM sqlite_sequence WHERE name='notes'`);

      for (const cat of jsonData.categories) {
        await db.run(
          `INSERT INTO categories (id, name) VALUES (?, ?)`,
          [cat.id, cat.name]
        );
      }

      for (const ben of jsonData.beneficiaries) {
        await db.run(
          `INSERT INTO beneficiaries (id, name) VALUES (?, ?)`,
          [ben.id, ben.name]
        );
      }

      for (const item of jsonData.expense_item) {
        await db.run(
          `INSERT INTO expense_item (id, date, item_name, amount, category_id, beneficiary_id, spent, created_date, updated_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            item.date,
            item.item_name,
            item.amount,
            item.category_id,
            item.beneficiary_id,
            item.spent,
            item.created_date,
            item.updated_date
          ]
        );
      }

      for (const note of jsonData.notes) {
        await db.run(
          `INSERT INTO notes (id, date, name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
          [note.id, note.date, note.name, note.created_at, note.updated_at]
        );
      }
    });

    console.log('Database restored successfully!');
  }

}
