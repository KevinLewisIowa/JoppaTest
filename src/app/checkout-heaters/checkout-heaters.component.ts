import { Component, OnInit } from '@angular/core';
import { Heater } from '../models/heater';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';

@Component({
  selector: 'app-checkout-heaters',
  templateUrl: './checkout-heaters.component.html',
  styleUrls: ['./checkout-heaters.component.css']
})
export class CheckoutHeatersComponent implements OnInit {
  heaters: any[];
  routeInstanceHeaterInteraction: RouteInstanceHeaterInteraction;
  checkedOutRouteInstanceHeaters: RouteInstanceHeaterInteraction[] = [];
  isEndOfRoute: boolean = false;

  constructor(private mainService: MainService, private router: Router) { 
    
  }

  ngOnInit() {
    this.mainService.getAvailableHeaters().subscribe(heaterList => {
      this.heaters = heaterList;
    }, error => console.log(error));

    if (JSON.parse(window.localStorage.getItem('checkedOutHeaters')) !== null && JSON.parse(window.localStorage.getItem('checkedOutHeaters')).length > 0) {
      this.checkedOutRouteInstanceHeaters = JSON.parse(window.localStorage.getItem('checkedOutHeaters'));
      this.isEndOfRoute = confirm('Please press OK to check in heaters at the end of the route or Cancel to continue checking out heaters.');
    }
  }

  checkoutHeater(heaterId: number) {
    let isAlreadyCheckedOut: boolean;
    this.mainService.isHeaterCheckedOutOnOtherRoute(heaterId).subscribe((data: RouteInstanceHeaterInteraction[]) => {
      isAlreadyCheckedOut = data.filter(routeInstance => routeInstance.route_instance_id !== JSON.parse(window.localStorage.getItem('routeInstance'))).length > 0;

      if (!isAlreadyCheckedOut) {
        this.routeInstanceHeaterInteraction = new RouteInstanceHeaterInteraction();
      
        this.routeInstanceHeaterInteraction.heater_id = heaterId;
        this.routeInstanceHeaterInteraction.is_checked_out = true;
        this.routeInstanceHeaterInteraction.route_instance_id = JSON.parse(window.localStorage.getItem('routeInstance'));
  
        this.mainService.checkoutHeater(this.routeInstanceHeaterInteraction).subscribe((data: RouteInstanceHeaterInteraction) => {
          this.checkedOutRouteInstanceHeaters.push(data);
          window.localStorage.setItem('checkedOutHeaters', JSON.stringify(this.checkedOutRouteInstanceHeaters));
        }, error => console.log(error));
      }
      else {
        alert('This heater has already been checked out on another route.');
      }
    });
  }

  checkInHeater(heaterId: number) {
    let routeInstanceHeaterInteractionToCheckIn: RouteInstanceHeaterInteraction = this.checkedOutRouteInstanceHeaters.find(routeInstanceHeater => routeInstanceHeater.heater_id === heaterId);

    let indexToDelete: number = this.checkedOutRouteInstanceHeaters.indexOf(routeInstanceHeaterInteractionToCheckIn);
    if (indexToDelete > -1) {
      this.checkedOutRouteInstanceHeaters.splice(indexToDelete, 1);
      window.localStorage.setItem('checkedOutHeaters', JSON.stringify(this.checkedOutRouteInstanceHeaters));
    }

    routeInstanceHeaterInteractionToCheckIn.is_checked_out = false;
    this.mainService.checkInHeater(routeInstanceHeaterInteractionToCheckIn)
      .subscribe(data => { }, error => console.log(error));
  }

  isHeaterCheckedOut(heaterId: number): boolean {
    let routeInstanceHeaterInteraction: RouteInstanceHeaterInteraction = this.checkedOutRouteInstanceHeaters.find(routeInstanceHeater => routeInstanceHeater.heater_id === heaterId);
    return routeInstanceHeaterInteraction !== undefined;
  }

  next() {
    this.router.navigate(['volunteerInfo']);
  }

  endRoute() {
    window.localStorage.clear();
    this.router.navigate(['login']);
  }
}
