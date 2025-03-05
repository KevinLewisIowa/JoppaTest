import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { RouteInstance } from '../models/route-instance';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';
import { Appearance } from 'app/models/appearance';
import { ClientService } from 'app/services/client.service';
import { Client } from 'app/models/client';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmDialogModel, CustomConfirmationDialogComponent } from 'app/custom-confirmation-dialog/custom-confirmation-dialog.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DateSelectorComponent } from 'app/insert-modals/date-selector/date-selector.component';

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

  constructor(private mainService: MainService, private clientService:ClientService, private modalService: NgbModal, private router: Router, public dialog: MatDialog) {
    
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
    let primary_device: boolean = JSON.parse(window.localStorage.getItem('primary_device'));
    let routeAttendanceList:Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));

    if (routeAttendanceList == null) {
      return;
    }

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

    let title: string = 'Confirm Action';
    let confirmText: string = 'Yes';
    let dismissText: string = 'No';
    let message: string;
    if (routeAttendanceList.length == 0) {
      message = 'You have chosen to end a route with no attendance taken. Are you sure you want to end this route?';
    }
    else {
      message = 'Are you sure you want to end the route';
    }

    const dialogData = new ConfirmDialogModel(title, message, confirmText, dismissText);
    const dialogRef = this.dialog.open(CustomConfirmationDialogComponent, {data: dialogData, maxWidth:'400px'});

    dialogRef.afterClosed().subscribe(result => {
      let canContinue: boolean = JSON.parse(result);

      if (canContinue) {
        this.continueWithEndingRoute(heatRoute, routeInstanceId, primary_device);
      }
      else {
        this.mainService.showEndRoute.next(true);
        return;
      }
    });
  }

  private continueWithEndingRoute(heatRoute: boolean, routeInstanceId: any, primary_device: boolean) {
    this.mainService.showEndRoute.next(false);
    
    // if (heatRoute) {
    //   this.router.navigate(['checkoutHeaters']);
    // }
    if (this.isAdmin) {
      this.goToAdminHome();
    }
    else {
      if (primary_device) {
        this.mainService.getRouteInstance(routeInstanceId).subscribe(data => {
          this.routeInstance = data;
  
          if (new Date(this.routeInstance.start_time).getDate() < new Date().getDate()) {
            this.routeInstance.end_time = new Date(this.routeInstance.start_time);
            this.routeInstance.end_time.setHours(this.routeInstance.end_time.getHours() + 5);
              
              this.mainService.updateRouteInstance(this.routeInstance).subscribe((data) => {
                let apiKey: string = window.localStorage.getItem('apiToken');
                window.localStorage.clear();
                window.localStorage.setItem('apiToken', apiKey);
                window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
      
                this.router.navigate(['login']);
              }, error => console.log(error));
          }
          else {
            this.routeInstance.end_time = new Date();
  
            this.mainService.updateRouteInstance(this.routeInstance).subscribe((data) => {
              let apiKey: string = window.localStorage.getItem('apiToken');
              window.localStorage.clear();
              window.localStorage.setItem('apiToken', apiKey);
              window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
    
              this.router.navigate(['login']);
            }, error => console.log(error));
          }
        }, error => console.log(error));
      }
      else {
        window.localStorage.clear();
        this.router.navigate(['login']);
      }
      
    }
  }

  goToAdminHome() {
    let apiKey: string = window.localStorage.getItem('apiToken');
    window.localStorage.clear();
    window.localStorage.setItem('apiToken', apiKey);
    window.localStorage.setItem('isAdmin', JSON.stringify(true));
    this.router.navigate(['adminHome']);
  }

}
