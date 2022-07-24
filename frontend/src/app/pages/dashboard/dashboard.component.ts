import { AfterContentInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';
import { Observable } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BarChartData, LineChartData, PieChartData } from 'src/app/models/charts-data';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalTurnover$: Observable<number>;
  expectedTurnover$: Observable<number>;
  totalProfit$: Observable<number>;
  expectedProfit$: Observable<number>;

  totalTurnoverGraphData$: Observable<any>;
  totalProfitGraphData$: Observable<any>;

  levelSpreadingGraphData$: Observable<any>;
  professionSpreadingGraphData$: Observable<any>;

  public turnoverChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'CA (ventes effectives)',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(103,58,183,0.3)'
      }
    ]
  };

  public profitChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Bénéfice (ventes effectives)',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(103,58,183,0.3)'
      }
    ]
  };

  public levelChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Répartitions du niveau des objets',
        backgroundColor: 'rgba(103,58,183,0.3)'
      }
    ]
  };

  public professionChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Métier',
        // backgroundColor: 'rgba(103,58,183,0.3)'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins : {
      legend: {
        position: 'left'
      }
    }
  };

  public lineChartLegend = true;

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

  constructor(
    private statsService: StatsService
  ) { 
    this.totalTurnover$ = this.statsService.getTotalTurnover();
    this.expectedTurnover$ = this.statsService.getExpectedTurnover();
    this.totalProfit$ = this.statsService.getTotalProfit();
    this.expectedProfit$ = this.statsService.getExpectedProfit();

    this.totalTurnoverGraphData$ = this.statsService.getTotalTurnoverGraphData();
    this.totalTurnoverGraphData$.subscribe(chartData => {
      this.turnoverChartData.labels = chartData.map((data: LineChartData) => data.month.label);
      this.turnoverChartData.datasets[0].data = chartData.map((data: LineChartData) => data.value);
      this.charts?.forEach((child) => {
        child.chart?.update()
      });
    });

    this.totalProfitGraphData$ = this.statsService.getTotalProfitGraphData();
    this.totalProfitGraphData$.subscribe(chartData => {
      this.profitChartData.labels = chartData.map((data: LineChartData) => data.month.label);
      this.profitChartData.datasets[0].data = chartData.map((data: LineChartData) => data.value);
      this.charts?.forEach((child) => {
        child.chart?.update()
      });
    });

    this.levelSpreadingGraphData$ = this.statsService.getLevelSpreadingGraphData();
    this.levelSpreadingGraphData$.subscribe(chartData => {
      console.log('chartData', chartData);
      this.levelChartData.labels = chartData.map((data: BarChartData) => data.range.label);
      this.levelChartData.datasets[0].data = chartData.map((data: BarChartData) => data.value);
      this.charts?.forEach((child) => {
        child.chart?.update()
      });
    });

    this.professionSpreadingGraphData$ = this.statsService.getProfessionSpreadingGraphData();
    this.professionSpreadingGraphData$.subscribe(chartData => {
      console.log('chartData', chartData);
      this.professionChartData.labels = chartData.map((data: PieChartData) => data.label);
      this.professionChartData.datasets[0].data = chartData.map((data: PieChartData) => data.value);
      this.charts?.forEach((child) => {
        child.chart?.update()
      });
    });

  }
  
  ngOnInit(): void { 
  }

  numberWithSpaces(number : number) : String{
    number = Math.round((number + Number.EPSILON) * 100) / 100;
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }

}
