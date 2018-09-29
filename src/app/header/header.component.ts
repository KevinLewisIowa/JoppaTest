import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  title = 'Joppa';
  routesActivated = false;
  heatRoutes = false;
  outreachRoutes = false;
  isHeatRoute = false;
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (this.router.url === '/routes') {
        this.routesActivated = true;
      } else {
        this.routesActivated = false;
      }
    })
    const routeType = window.localStorage.getItem('routeType');

    if (routeType == 'heat') {
      this.isHeatRoute = true;
      this.heatRoutes = true;
    } else {
      this.isHeatRoute = false;
      this.outreachRoutes = true;
    }
  }

  selectedHeat() {
    this.isHeatRoute = true;
    window.localStorage.setItem('routeType', 'heat');
    this.heatRoutes = true;
    this.outreachRoutes = false;
  }

  selectedOutreach() {
    this.isHeatRoute = false;
    this.heatRoutes = false;
    this.outreachRoutes = true;
    window.localStorage.setItem('routeType', 'outreach');
  }
}
