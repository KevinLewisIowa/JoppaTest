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
    if (routeAttendanceList != null) {
      if (routeAttendanceList.length == 0) {
        if (!confirm('You have chosen to end a route with no attendance taken.  Are you sure you want to end this route?')) {
          return;
        }
      }
    }

    this.mainService.showEndRoute.next(false);

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
      this.saveAttendanceInfo(routeAttendanceList)
      let apiKey: string = window.localStorage.getItem('apiToken');
      window.localStorage.clear();
      window.localStorage.setItem('apiToken', apiKey);
      window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
      this.router.navigate(['login']);
    }
  }

  saveAttendanceInfo(routeAttendanceList: Appearance[]) {
    routeAttendanceList.forEach((appearance:Appearance) => {
      console.log('Inserting route attendance');
      let client:Client = new Client();
      this.clientService.getClientById(appearance.client_id).subscribe(data => {
        client = data;

        if (appearance.serviced) {
          client.last_interaction_date = new Date();
        } else if (appearance.still_lives_here == false) {
          client.previous_camp_id = appearance.location_camp_id;
          client.current_camp_id = null;
        }

        this.clientService.updateClient(client).subscribe(data => {
  
        }, error => console.log(error));

        this.clientService.insertClientAppearance(appearance).subscribe(data => { }, error => console.log(error));
      }); 
     });
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
