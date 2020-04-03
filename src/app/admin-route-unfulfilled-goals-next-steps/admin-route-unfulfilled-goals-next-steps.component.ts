import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from '../services/main.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-route-unfulfilled-goals-next-steps',
  templateUrl: './admin-route-unfulfilled-goals-next-steps.component.html',
  styleUrls: ['./admin-route-unfulfilled-goals-next-steps.component.css']
})
export class AdminRouteUnfulfilledGoalsNextStepsComponent implements OnInit {

  unfulfilledGoalsNextSteps: Observable<any>[] = [];

  constructor(private service: MainService) { };

  backIcon = faChevronLeft;

  ngOnInit() {
    this.service.getAdminRouteUnfulfilledGoalsNextSteps().subscribe(data => {
      this.unfulfilledGoalsNextSteps = data, error => {
        console.log(error);
      }
    });
  }

}
