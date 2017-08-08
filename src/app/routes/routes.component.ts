import { Component, OnInit } from '@angular/core';
import { Route } from '../models/Route';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
routes : Route[] = [];
  constructor(private mainService: MainService , private router : Router) { 
    /*this.mainService.getRoutes().subscribe((data) => {
      console.log('returned data:');
      console.log(data);
      this.routes = data;
    })*/
    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes;
    })
  }

  ngOnInit() {
  }

  openRoute(id){
    this.router.navigate(['/route', id]);
  }
}
