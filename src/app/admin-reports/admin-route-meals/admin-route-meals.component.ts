import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MainService } from 'app/services/main.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-route-meals',
  templateUrl: './admin-route-meals.component.html',
  styleUrls: ['./admin-route-meals.component.css']
})
export class AdminRouteMealsComponent implements OnInit, OnDestroy {

  routeMeals: Observable<any>[] = [];
  private destroy$ = new Subject<void>();

  constructor(private service: MainService) { }

  backIcon = faChevronLeft;

  ngOnInit() {
    this.service.getAdminRouteNumberMeals()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.routeMeals = data;
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
