import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { RouteInstance } from '../models/route-instance';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  routes : Route[] = [];
  route_id: number = JSON.parse(window.localStorage.getItem('routeId'));
  routeInstance: RouteInstance = new RouteInstance();

  constructor(private mainService: MainService , private router : Router) { 
    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes.filter(route => route.id === this.route_id);
    })
  }

  ngOnInit() {
  }

  openRoute(id){
    this.router.navigate(['/route', id]);
  }

  endRoute() {
    var routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));

    if (routeInstanceId !== null) {
      this.mainService.getRouteInstance(routeInstanceId).subscribe(data => {
        this.routeInstance = data;
        this.routeInstance.end_time = new Date();

        console.log(this.routeInstance);
        this.mainService.updateRouteInstance(this.routeInstance);
        console.log(this.routeInstance);
      }, error => console.log(error));
    }
  }
}
