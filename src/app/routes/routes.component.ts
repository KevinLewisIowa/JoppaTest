import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route } from '../models/route';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { RouteInstance } from '../models/route-instance';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit, OnDestroy {
  routes: Route[] = [];
  route_id: number = JSON.parse(window.localStorage.getItem('routeId'));
  routeInstance: RouteInstance = new RouteInstance();
  faPlus = faPlus;
  backIcon = faChevronLeft;
  private destroy$ = new Subject<void>();


  constructor(private mainService: MainService, private router: Router) {
  }

  ngOnInit() {
    this.mainService.getRouteListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        routes => this.routes = routes,
        error => console.error('Unable to load routes and their counts', error)
      );
  }

  openRoute(id) {
    this.router.navigate(['/route', id]);
  }

  endRoute() {
    var routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));

    if (routeInstanceId !== null) {
      this.mainService.getRouteInstance(routeInstanceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.routeInstance = data;
          this.routeInstance.end_time = new Date();

          console.log(this.routeInstance);
          this.mainService.updateRouteInstance(this.routeInstance)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (response) => { },
              (error) => {
                console.log(error);
              }
            );
          console.log(this.routeInstance);
        }, error => console.log(error));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
