import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-admin-route-unfulfilled-prayer-requests-needs',
  templateUrl: './admin-route-unfulfilled-prayer-requests-needs.component.html',
  styleUrls: ['./admin-route-unfulfilled-prayer-requests-needs.component.css']
})
export class AdminRouteUnfulfilledPrayerRequestsNeedsComponent implements OnInit {

  unfulfilledPrayerRequestsNeeds: Observable<any>[] = [];

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service.getAdminRouteUnfulfilledPrayerRequestsNeeds().subscribe(data => {
      this.unfulfilledPrayerRequestsNeeds = data, error => {
        console.log(error);
      }
    })
  }

}
