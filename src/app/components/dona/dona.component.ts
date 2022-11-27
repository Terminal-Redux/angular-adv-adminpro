import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent {
  @Input() title: string = 'Sin titulo';
  @Input() data: number[] = [350, 450, 100];

  // Doughnut
  @Input('labels') doughnutChartLabels: string[] = [
    'Label1',
    'Label2',
    'Label3',
  ];
  public colors: Color[] = ['#6857E6', '#009FEE', '#F02059'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: this.data, backgroundColor: this.colors }],
  };
  public doughnutChartType: ChartType = 'doughnut';

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [{ data: this.data, backgroundColor: this.colors }],
    };
  }
}
