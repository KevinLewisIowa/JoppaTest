import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { RouteInstance } from '../models/route-instance';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';
import { Appearance } from 'app/models/appearance';
import { ClientService } from 'app/services/client.service';
import { Client } from 'app/models/client';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  routeInstance: RouteInstance = new RouteInstance();
  isAdmin: boolean;
  showEndRoute: boolean = true;

  constructor(private mainService: MainService, private clientService:ClientService, private router: Router) {
    
  }

  ngOnInit() {
    this.mainService.showEndRoute.subscribe(value => {
      this.showEndRoute = value;
    });
    this.mainService.showAdminHome.subscribe(value => {
      this.isAdmin = value;
    });

    if (JSON.parse(window.localStorage.getItem('RouteAttendance')) == null) {
      let routeAttendanceList:Appearance[] = [];
      window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
    }
  }

  endRoute() {
    let routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
    let heatRoute: boolean = JSON.parse(window.localStorage.getItem('heatRoute'));

    let routeAttendanceList:Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));

    if (routeAttendanceList == null) {
      return;
    }

    //TODO
    //Check if routeAttendanceList length is 0
    ////If so, ask modified message 'with no attendance'
    //////If confirmed, mark as clearing out
    //
    //If routeAttendanceList length is more than 0
    ////Ask message of wanting to end route
    //////If confirmed, mark as clearing out
    //
    //For clearing out, if heatRoute, go to checkoutHeaters screen
    //If outreach route, clear out things
    ///If admin, add admin route things back

    let continueWithEndingRoute: boolean = false;
    if (routeAttendanceList.length == 0) {
      if (confirm('You have chosen to end a route with no attendance taken. Are you sure you want to end this route?')) {
        continueWithEndingRoute = true;
      } else {
        this.mainService.showEndRoute.next(true);
        return;
      }
    }
    else {
      if (confirm('Are you sure you want to end the route?')) {
        continueWithEndingRoute = true;
      }
      else {
        this.mainService.showEndRoute.next(true);
        return;
      }
    }

    if (continueWithEndingRoute) {
      this.mainService.showEndRoute.next(false);
      
      if (heatRoute) {
        this.router.navigate(['checkoutHeaters']);
      } else {
        this.mainService.getRouteInstance(routeInstanceId).subscribe(data => {
          this.routeInstance = data;
          this.routeInstance.end_time = new Date();
  
          this.mainService.updateRouteInstance(this.routeInstance);
        }, error => console.log(error));
        let apiKey: string = window.localStorage.getItem('apiToken');
        window.localStorage.clear();
        window.localStorage.setItem('apiToken', apiKey);
        window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
        
        this.router.navigate(['login']);
      }
    }

    // this.mainService.showEndRoute.next(false);

    // this.mainService.getRouteInstance(routeInstanceId).subscribe(data => {
    //   this.routeInstance = data;
    //   this.routeInstance.end_time = new Date();

    //   this.mainService.updateRouteInstance(this.routeInstance);
    // }, error => console.log(error));

    // if (heatRoute && !this.isAdmin) {
    //   if (!confirm('Are you sure you want to end the route?')) {
    //     this.mainService.showEndRoute.next(true);
    //     return;
    //   } else{
    //     this.router.navigate(['checkoutHeaters']);
    //   }
    // }
    // else if (routeAttendanceList.length !== null && routeAttendanceList.length !== 0) {
    //   if (!confirm('Are you sure you want to end the route?')) {
    //     this.mainService.showEndRoute.next(true);
    //     return;
    //   } else {
    //     let apiKey: string = window.localStorage.getItem('apiToken');
    //     window.localStorage.clear();
    //     window.localStorage.setItem('apiToken', apiKey);
    //     window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
    //     this.router.navigate(['login']);
    //   }
    // }
  }

  goToAdminHome() {
    let apiKey: string = window.localStorage.getItem('apiToken');
    window.localStorage.clear();
    window.localStorage.setItem('apiToken', apiKey);
    window.localStorage.setItem('isAdmin', JSON.stringify(true));
    let routeAttendanceList:Appearance[] = [];
    window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
    this.router.navigate(['adminHome']);
  }

}
