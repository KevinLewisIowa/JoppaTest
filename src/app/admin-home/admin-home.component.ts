import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appearance } from 'app/models/appearance';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  createNewHeater() {
    this.router.navigate([`heaterNew`]);
  }

  openAdminReports() {
    this.router.navigate(['/admin/reports']);
  }

  goToRoutes() {
    this.setRouteAttendance();
    this.router.navigate(['routes']);
  }

  checkInAllHeaters() {
    this.router.navigate(['/admin/checkInAllHeaters']);
  }

  goToHeatRoutes() {
    window.localStorage.setItem('heatRoute', JSON.stringify(true));
    this.setRouteAttendance();
    this.router.navigate(['routes']);
  }

  openChangeRegularPassword() {
    this.router.navigate(['changeRegularPassword']);
  }

  gotToClientListing() {
    this.router.navigate(['/admin/clientListing']);
  }

  setRouteAttendance() {
    if (JSON.parse(window.localStorage.getItem('RouteAttendance')) == null) {
      let routeAttendanceList:Appearance[] = [];
      window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
    }
  }
}
