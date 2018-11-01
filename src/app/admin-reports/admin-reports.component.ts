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
    this.router.navigate(['/admin/routeUndeliveredItems']);
  }

  openAdminRouteNumberMeals() {
    this.router.navigate(['/admin/routeMeals']);
  }

  openAdminRouteUnfulfilledGoalsNextSteps() {
    this.router.navigate(['/admin/routeUnfulfilledGoalsNextSteps']);
  }

  openAdminRouteUnfulfilledPrayerRequestsNeeds() {
    this.router.navigate(['/admin/routeUnfulfilledPrayerRequestsNeeds']);
  }

  openAdminHeaterListing() {
    this.router.navigate([`/admin/heaterListing`]);
  }

}
