import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component {
  public labels1: string[] = [
    'Ventas en linea',
    'Ventas en tienda',
    'Ventas por correo',
  ];
  public data1: number[] = [231, 154, 457];
}
