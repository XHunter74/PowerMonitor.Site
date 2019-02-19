import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-real-data',
  templateUrl: './real-data.component.html',
})


export class RealDataComponent  implements OnInit{
  
  private maxVoltage = 270;
  private nominalVoltage = 220;
  private voltage = 230;

  public canvasWidth = 300
  public needleValue = Math.round(230 / this.maxVoltage * 100)
  public centralLabel = ''
  public name = 'Voltage, V'
  public bottomLabel = this.voltage.toString()
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['green', 'red'],
    arcDelimiters: [Math.round(this.nominalVoltage / this.maxVoltage * 100)],
    rangeLabel: ['0', this.maxVoltage.toString()],
    needleStartValue: 50,
  }

  ngOnInit(): void {
  }
}
