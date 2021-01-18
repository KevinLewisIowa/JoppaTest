import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Appearance } from "app/models/appearance";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { MainService } from "app/services/main.service";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.css"],
})
export class AdminHomeComponent implements OnInit {
  constructor(private mainService: MainService, private router: Router) {}

  backIcon = faChevronLeft;
  isAdmin: boolean;
  routeInstanceId: number;

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
    this.mainService.showAdminHome.next(this.isAdmin);
    this.routeInstanceId = JSON.parse(
      window.localStorage.getItem("routeInstance")
    );
    this.mainService.showEndRoute.next(this.routeInstanceId != null);
  }

  createNewHeater() {
    this.router.navigate([`heaterNew`]);
  }

  openAdminReports() {
    this.router.navigate(["/admin/reports"]);
  }

  goToRoutes() {
    this.setRouteAttendance();
    this.router.navigate(["routes"]);
  }

  checkInAllHeaters() {
    this.router.navigate(["/admin/checkInAllHeaters"]);
  }

  goToHeatRoutes() {
    window.localStorage.setItem("heatRoute", JSON.stringify(true));
    this.setRouteAttendance();
    this.router.navigate(["routes"]);
  }

  openChangeRegularPassword() {
    this.router.navigate(["changeRegularPassword"]);
  }

  goToClientListing() {
    this.setRouteAttendance();
    this.router.navigate(["/admin/clientListing"]);
  }

  goToCampListing() {
    this.router.navigate(["/admin/campListing"]);
  }

  setRouteAttendance() {
    if (JSON.parse(window.localStorage.getItem("RouteAttendance")) == null) {
      let routeAttendanceList: Appearance[] = [];
      window.localStorage.setItem(
        "RouteAttendance",
        JSON.stringify(routeAttendanceList)
      );
    }
  }
}
