import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  constructor(private mainService:MainService, private router: Router) { };

  backIcon = faChevronLeft;
  isAdmin: boolean;
  routeInstanceId: number;

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.mainService.showAdminHome.next(this.isAdmin);
    this.routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
    this.mainService.showEndRoute.next(this.routeInstanceId != null);
  }

  openNewClientsReport() {
    this.router.navigate(['/admin/reports/newClients']);
  }

  openInventoryReport() {
    this.router.navigate(['/admin/reports/inventoryReport']);
  }

  openOverallAttendanceReport() {
    this.router.navigate(['/admin/reports/overallAttendance']);
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

  openFirstTimeHomelessnessReport() {
    this.router.navigate([`/admin/reports/firstTimeHomelessnessReport`]);
  }

}
