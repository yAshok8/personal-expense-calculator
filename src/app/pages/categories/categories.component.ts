import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from "ng2-charts";
import { ExpenseCategoryService } from "../../services/expense-category.service";
import {AddCategoryModalComponent} from "../add-category-modal/add-category-modal.component";
import {ModalController} from "@ionic/angular";
import { PopoverController } from '@ionic/angular';
import {CategoryExpensePopoverComponent} from "./expense-category.popover.component";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor(
    private _categoriesService: ExpenseCategoryService,
    private modalController: ModalController,
    private popoverCtrl: PopoverController
  ) {}

  protected totalExpenses: number = 0;
  protected categoryTotals: { id: number; name: string; total: number }[] = [];

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  async ngOnInit() {}

  async ionViewWillEnter() {
    try {
      this.categoryTotals = await this._categoriesService.getCategoryTotalsForMonth(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );
      await this.loadCategoryChart();
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  async loadCategoryChart() {
    // store totals for percentage calc
    this.totalExpenses = this.categoryTotals.reduce((sum, c) => sum + Number(c.total), 0);

    this.pieChartData.labels = this.categoryTotals.map(c => c.name);
    this.pieChartData.datasets[0].data = this.categoryTotals.map(c => Number(c.total));
    this.pieChartData.datasets[0].backgroundColor = this.categoryTotals.map(() => this.getRandomColor());

    this.chart?.update();
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`; // semi-transparent
  }

  getCategoryIcon(name: string): string {
    const iconMap: Record<string, string> = {
      'Dineout': 'restaurant-outline',
      'Transport': 'car-outline',
      'Leisure': 'game-controller-outline',
      'Shopping': 'bag-outline',
      'Bills': 'cash-outline',
      'Health': 'fitness-outline',
      'Other': 'ellipsis-horizontal-circle-outline'
    };
    return iconMap[name] || 'help-circle-outline'; // fallback
  }

  getPercentage(total: number): number {
    if (!this.totalExpenses || this.totalExpenses === 0) return 0;
    return Math.round((total / this.totalExpenses) * 100);
  }

  async openAddCategoryModal() {
    const modal = await this.modalController.create({
      component: AddCategoryModalComponent
    });

    modal.onDidDismiss().then(async (dataReturned) => {
      if (dataReturned?.data?.refresh) {
        await this.loadCategories();
      }
    });

    return await modal.present();
  }

  async loadCategories() {
    try {
      this.categoryTotals = await this._categoriesService.getCategoryTotalsForMonth(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );
      await this.loadCategoryChart();
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  async openCategoryDetails(ev: Event, categoryId: number) {
    const popover = await this.popoverCtrl.create({
      component: CategoryExpensePopoverComponent,
      componentProps: { categoryId },
      event: ev,
      translucent: true,
      cssClass: 'category-popover-class'
    });
    await popover.present();
  }


}
