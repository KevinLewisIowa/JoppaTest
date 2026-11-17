import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { Route } from 'app/models/route';
import { RouteInstance } from 'app/models/route-instance';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-route-summary-report',
  templateUrl: './route-summary-report.component.html',
  styleUrls: ['./route-summary-report.component.css']
})
export class RouteSummaryReportComponent implements OnInit, OnDestroy {
  routes: Route[] = [];
  routeInstance: RouteInstance;
  notes: any[];
  backIcon = faChevronLeft;
  routeDate: Date;
  routeInstances: RouteInstance[];
  private destroy$ = new Subject<void>();

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
    this.mainService.getTheRoutes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Route[]) => {
        this.routes = data;
      });
  }

  loadRouteInstance(routeId: number) {
    this.routeInstances = undefined;
    this.routeInstance = undefined;
    this.notes = undefined;
    if (this.routeDate) {
      this.mainService.getRouteInstancesForDate(this.routeDate, routeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          // Select route instance from data list
          this.routeInstances = data;
        }, error => console.log(error));
    }
    else {
      alert('Please enter a date.');
      return;
    }
  }

  selectRouteInstance(routeInstanceId: number) {
    this.routeInstance = undefined;
    this.notes = undefined;
    this.mainService.getLatestRouteInstanceInfoForRoute(routeInstanceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(routeInstance => {
        if (routeInstance[0] !== undefined) {
          this.routeInstance = routeInstance[0];
          
          this.mainService.getNotesForRouteInstance(this.routeInstance.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(routeNotes => {
              this.notes = routeNotes;
            }, error => console.log(error));
        }
      }, error => console.log(error));
  }

  back() {
    this.router.navigate([`/admin/reports`]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
