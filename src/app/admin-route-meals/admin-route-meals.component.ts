import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-admin-route-meals',
  templateUrl: './admin-route-meals.component.html',
  styleUrls: ['./admin-route-meals.component.css']
})
export class AdminRouteMealsComponent implements OnInit {

  routeMeals: Observable<any>[] = [];

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service.getAdminRouteNumberMeals().subscribe(data => {
      this.routeMeals = data, error => {
        console.log(error);
      }
    });
  }

}
