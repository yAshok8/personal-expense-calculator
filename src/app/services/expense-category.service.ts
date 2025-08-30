import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {SQLiteDBConnection} from "@capacitor-community/sqlite";
import {Expense} from "../models/expense";

@Injectable({
  providedIn: 'root',
})
export class ExpenseCategoryService {

  constructor(private _dbService: DatabaseService) {
  }

  async getCategoriesList(): Promise<string[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT name from categories`);
      return result.values || [];
    });
  }

  async truncateCategories(): Promise<void> {
    return this._dbService.executeQuery(async (db) => {
      await db.run(`DELETE FROM categories`);
    });
  }

}
