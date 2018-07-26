import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-route-undelivered-items',
  templateUrl: './admin-route-undelivered-items.component.html',
  styleUrls: ['./admin-route-undelivered-items.component.css']
})
export class AdminRouteUndeliveredItemsComponent implements OnInit {

  undeliveredItems: Observable<any>[] = [];

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service.getAdminRouteUndeliveredItems().subscribe(data => {
      this.undeliveredItems = data, error => {
        console.log(error);
      }
    });
  }

}
