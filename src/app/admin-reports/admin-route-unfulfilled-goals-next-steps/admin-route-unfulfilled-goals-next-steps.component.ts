import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MainService } from '../../services/main.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-route-unfulfilled-goals-next-steps',
  templateUrl: './admin-route-unfulfilled-goals-next-steps.component.html',
  styleUrls: ['./admin-route-unfulfilled-goals-next-steps.component.css']
})
export class AdminRouteUnfulfilledGoalsNextStepsComponent implements OnInit, OnDestroy {

  unfulfilledGoalsNextSteps: Observable<any>[] = [];
  private destroy$ = new Subject<void>();

  constructor(private service: MainService) { };

  backIcon = faChevronLeft;

  ngOnInit() {
    this.service.getAdminRouteUnfulfilledGoalsNextSteps()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.unfulfilledGoalsNextSteps = data;
        console.log(JSON.stringify(data));
      }, error => console.log(error));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
