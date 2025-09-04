import { Component } from '@angular/core';
import { ExpenseCategoryService } from "../../services/expense-category.service";
import { ExpenseDbService } from "../../services/expense.service";
import { Capacitor } from "@capacitor/core";
import { DbRestoreService } from "../../services/db.restore-service";
import { ToastController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(
    private catDBService: ExpenseCategoryService,
    private expDBService: ExpenseDbService,
    private restoreDbService: DbRestoreService,
    private toastController: ToastController
  ) {}

  async downloadDatabase() {
    const categories = await this.catDBService.getAllCategories();
    const expenseItems = await this.expDBService.getAllExpenseItems();

    const data = {
      categories: categories || [],
      expense_item: expenseItems || []
    };

    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `expense_backup_${Date.now()}.json`;

    if (Capacitor.isNativePlatform()) {
      try {
        // 1️⃣ Save JSON to a temporary file in app storage
        const file = await Filesystem.writeFile({
          path: fileName,
          data: jsonString,
          directory: Directory.Cache, // Temporary cache directory
          encoding: Encoding.UTF8
        });

        // 2️⃣ Share the file via native share sheet
        await Share.share({
          title: 'Export Expense Backup',
          text: 'Here is your backup file',
          url: file.uri, // Use the file URI, not a Blob URL
          dialogTitle: 'Share or Save File'
        });
      } catch (err) {
        console.error('Error sharing file:', err);
      }
    } else {
      const blob = new Blob([jsonString], {type: 'application/json'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      console.log('Downloaded via browser');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  /** Restore database from the selected file */
  async restoreDatabase() {
    if (!this.selectedFile) return;

    const text = await this.selectedFile.text();
    const jsonData = JSON.parse(text);

    await this.restoreDbService.restoreDatabaseFromJson(jsonData);

    this.selectedFile = null;
    this.selectedFileName = null;

    const toast = await this.toastController.create({
      message: 'Database restored successfully!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

}
