import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openAdminRouteUndeliveredItems() {
    this.router.navigate(['/admin/routeUndeliveredItems'])
  }

  openAdminRouteNumberMeals() {
    this.router.navigate(['/admin/routeMeals'])
  }

  openAdminRouteUnfulfilledGoalsNextSteps() {
    this.router.navigate(['/admin/routeUnfulfilledGoalsNextSteps'])
  }

  openAdminRouteUnfulfilledPrayerRequestsNeeds() {
    this.router.navigate(['/admin/routeUnfulfilledPrayerRequestsNeeds'])
  }

  createNewHeater() {
    this.router.navigate([`heaterNew`])
  }

}
