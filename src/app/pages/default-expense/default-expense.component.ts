import {Component, Input, OnInit} from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { DefaultExpenseDbService, DefaultExpense } from '../../services/default-expense.service';
import {ExpenseBeneficiaryService} from "../../services/beneficiary.service";

@Component({
  selector: 'app-default-expense',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './default-expense.component.html',
  styleUrls: ['./default-expense.component.css']
})
export class DefaultExpenseComponent implements OnInit {

  defaultExpenses: DefaultExpense[] = [];
  newExpense: DefaultExpense = { name: '', amount: 0, beneficiaryId: null, beneficiaryName: null };
  beneficiaries: {id: number; name: string}[];

  constructor(
    private dbService: DefaultExpenseDbService,
    private alertCtrl: AlertController,
    private _beneficiariesService: ExpenseBeneficiaryService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    try {
      this.beneficiaries = await this._beneficiariesService.fetchAllBeneficiaries();
    } catch (err) {
      console.error("Error loading Beneficiaries:", err);
    }
  }

  async ngOnInit() {
    await this.loadExpenses();
  }

  async loadExpenses() {
    this.defaultExpenses = await this.dbService.getAllDefaultExpenses();
  }

  confirmBack() {
    this.router.navigate(['/tabs/home']);
  }

  async addExpense() {
    if (!this.newExpense.name || !this.newExpense.amount || !this.newExpense.beneficiaryId) {
      const alert = await this.alertCtrl.create({
        header: 'Missing Fields',
        message: 'Please fill all fields before adding.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    await this.dbService.addDefaultExpense(this.newExpense);
    this.newExpense = { name: '', amount: 0, beneficiaryId: null, beneficiaryName: null };
    await this.loadExpenses();
  }

  async saveExpense() {
    if (!this.newExpense.name || !this.newExpense.amount || !this.newExpense.beneficiaryId) {
      const alert = await this.alertCtrl.create({
        header: 'Missing Fields',
        message: 'Please fill all fields before saving.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.newExpense.id) {
      await this.dbService.updateDefaultExpense(this.newExpense);
    } else {
      await this.dbService.addDefaultExpense(this.newExpense);
    }

    this.newExpense = { name: '', amount: 0, beneficiaryId: null, beneficiaryName: null };
    await this.loadExpenses();
  }

  editExpense(exp: any) {
    this.newExpense = { ...exp }; // copies id, name, amount, beneficiaryId
  }


  async deleteExpense(id: number) {
    await this.dbService.deleteDefaultExpense(id);
    await this.loadExpenses();
  }
}
