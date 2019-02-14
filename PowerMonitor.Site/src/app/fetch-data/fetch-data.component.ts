import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherForecast, ServicesService } from '../services/services-service'
import { from } from 'rxjs';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];

  constructor(http: HttpClient, private servicesService: ServicesService) {
    this.refreshData();
  }

  async refreshData() {
    this.forecasts = null;
    try {
      this.forecasts = await this.servicesService.getSampleData();
    } catch (e) {
      alert('Something going wrong!');
    }
  }
}

