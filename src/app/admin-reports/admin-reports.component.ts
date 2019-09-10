import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openNewClientsReport() {
    this.router.navigate(['/admin/reports/newClients']);
  }

  openAdminRouteUndeliveredItems() {
    this.router.navigate(['/admin/reports/routeUndeliveredItems']);
  }

  openAdminRouteNumberMeals() {
    this.router.navigate(['/admin/reports/routeMeals']);
  }

  openAdminRouteUnfulfilledGoalsNextSteps() {
    this.router.navigate(['/admin/reports/routeUnfulfilledGoalsNextSteps']);
  }

  openAdminRouteUnfulfilledPrayerRequestsNeeds() {
    this.router.navigate(['/admin/reports/routeUnfulfilledPrayerRequestsNeeds']);
  }

  openAdminHeaterListing() {
    this.router.navigate([`/admin/reports/heaterListing`]);
  }

  openRouteSummaryReport() {
    this.router.navigate([`/admin/reports/routeSummary`]);
  }

  openHeatEquipmentPerRouteReport() {
    this.router.navigate([`/admin/reports/heatEquipmentPerRouteReport`]);
  }

  openSeenServicedReport() {
    this.router.navigate([`/admin/reports/seenServicedReport`]);
  }

  birthdayMonthsReport() {
    this.router.navigate([`/admin/reports/birthdayMonthsReport`]);
  }

}
