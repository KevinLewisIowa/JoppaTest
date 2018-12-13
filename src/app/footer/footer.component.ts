import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { RouteInstance } from '../models/route-instance';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  routeInstance: RouteInstance = new RouteInstance();
  isAdmin: boolean;

  constructor(private mainService: MainService, private router: Router) {
    
  }

  ngOnInit() { 
    this.isAdmin = JSON.parse(window.sessionStorage.getItem('isAdmin'));
    console.log(this.isAdmin);
  }

  endRoute() {
    let routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
    let heatRoute: boolean = JSON.parse(window.localStorage.getItem('heatRoute'));

    if (routeInstanceId !== null) {
      this.mainService.getRouteInstance(routeInstanceId).subscribe(data => {
        this.routeInstance = data;
        this.routeInstance.end_time = new Date();

        this.mainService.updateRouteInstance(this.routeInstance);
      }, error => console.log(error));
    }

    if (heatRoute && !this.isAdmin) {
      this.router.navigate(['checkoutHeaters']);
    }
    else
    {
      window.localStorage.clear();
      this.router.navigate(['login']);
    }
  }

  goToAdminHome() {
    window.localStorage.clear();
    this.router.navigate(['adminHome']);
  }

}
