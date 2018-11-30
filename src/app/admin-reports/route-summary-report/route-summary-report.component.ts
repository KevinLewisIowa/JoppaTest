import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { Route } from 'app/models/route';
import { RouteInstance } from 'app/models/route-instance';

@Component({
  selector: 'app-route-summary-report',
  templateUrl: './route-summary-report.component.html',
  styleUrls: ['./route-summary-report.component.css']
})
export class RouteSummaryReportComponent implements OnInit {
  routes: Route[] = [];
  routeInstance: RouteInstance;
  notes: any[];

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
    this.mainService.getTheRoutes().subscribe((data: Route[]) => {
      this.routes = data;
    });
  }

  loadRouteInstance(routeId: number) {
    this.routeInstance = undefined;
    this.notes = undefined;
    this.mainService.getLatestRouteInstanceInfoForRoute(routeId).subscribe(routeInstance => {
      if (routeInstance[0] !== undefined) {
        this.routeInstance = routeInstance[0];
      
        this.mainService.getNotesForRouteInstance(this.routeInstance.id).subscribe(routeNotes => {
          this.notes = routeNotes;
        }, error => console.log(error));
      }
    }, error => console.log(error));
  }

  back() {
    this.router.navigate([`/admin/reports`]);
  }

}
