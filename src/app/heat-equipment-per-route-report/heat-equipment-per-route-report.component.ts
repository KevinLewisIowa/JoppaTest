import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-heat-equipment-per-route-report',
  templateUrl: './heat-equipment-per-route-report.component.html',
  styleUrls: ['./heat-equipment-per-route-report.component.css']
})
export class HeatEquipmentPerRouteReportComponent implements OnInit {
  heatEquipmentData: any[] = [];

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
    this.mainService.getHeatEquipmentPerRoute().subscribe((data) => {
      this.heatEquipmentData = data;
    });
  }

  back() {
    this.router.navigate([`/admin/reports`]);
  }

}
