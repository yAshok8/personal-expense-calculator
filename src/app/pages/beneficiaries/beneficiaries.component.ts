import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartData} from 'chart.js';
import {BaseChartDirective} from "ng2-charts";
import {ExpenseBeneficiaryService} from "../../services/beneficiary.service";
import {BeneficiaryPopoverComponent} from "./beneficiary-popover.component";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-beneficiary-chart',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.css']
})
export class BeneficiariesComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private _beneficiaryService: ExpenseBeneficiaryService,
              private popoverCtrl: PopoverController) {}

  protected totalAmount: number = 0;
  protected beneficiaryTotals: { id: number; name: string; total: number }[] = [];

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
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      this.beneficiaryTotals = await this._beneficiaryService.getBeneficiaryTotalsForMonth(year, month);
      await this.loadBeneficiaryChart();
    } catch (err) {
      console.error("Error loading beneficiary chart:", err);
    }
  }

  async loadBeneficiaryChart() {
    this.totalAmount = this.beneficiaryTotals.reduce((sum, b) => sum + Number(b.total), 0);

    this.pieChartData.labels = this.beneficiaryTotals.map(b => b.name);
    this.pieChartData.datasets[0].data = this.beneficiaryTotals.map(b => Number(b.total));
    this.pieChartData.datasets[0].backgroundColor = this.beneficiaryTotals.map(() => this.getRandomColor());

    this.chart?.update();
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  }

  getPercentage(total: number): number {
    if (!this.totalAmount) return 0;
    return Math.round((total / this.totalAmount) * 100);
  }

  async openBeneficiaryExpenses(ev: Event, beneficiaryId: number) {
    const popover = await this.popoverCtrl.create({
      component: BeneficiaryPopoverComponent,
      componentProps: { beneficiaryId: beneficiaryId },
      event: ev,
      translucent: true
    });
    await popover.present();
  }

}
