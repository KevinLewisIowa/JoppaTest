import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { RouteInstance } from '../models/route-instance';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  routeInstanceId: number;
  routeInstance: RouteInstance = new RouteInstance();

  constructor(private mainService: MainService, private router: Router) {
    this.routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
  }

  ngOnInit() { }

  endRoute() {
    if (this.routeInstanceId !== null) {
      this.mainService.getRouteInstance(this.routeInstanceId).subscribe(data => {
        this.routeInstance = data;
        this.routeInstance.end_time = new Date();

        this.mainService.updateRouteInstance(this.routeInstance);
      }, error => console.log(error));
    }

    window.localStorage.clear();
    this.router.navigate(['/login']);
  }

}
