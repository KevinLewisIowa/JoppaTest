import { Component, OnInit } from '@angular/core';
import { Heater } from '../models/heater';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteInstanceTankHoseInteraction } from 'app/models/route-instance-tank-hose-interaction';
import { Appearance } from 'app/models/appearance';
import { ClientService } from 'app/services/client.service';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Client } from 'app/models/client';

@Component({
  selector: 'app-checkout-heaters',
  templateUrl: './checkout-heaters.component.html',
  styleUrls: ['./checkout-heaters.component.css']
})
export class CheckoutHeatersComponent implements OnInit {
  routeInstanceHeaterInteraction: RouteInstanceHeaterInteraction;
  checkedOutRouteInstanceHeaters: RouteInstanceHeaterInteraction[] = [];
  isEndOfRoute: boolean = false;
  isInitialCheckout: boolean = true;
  routeInstanceTankHoseForm : FormGroup;
  isAdmin: boolean;
  forwardIcon = faChevronRight;

  constructor(private fb:FormBuilder, private mainService: MainService, private clientService: ClientService, private router: Router) { 
    
  }

  ngOnInit() {
    let routeInstanceId: number = JSON.parse(window.localStorage.getItem('routeInstance'));
    if (routeInstanceId === null) {
      routeInstanceId = 0;
    }

    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));

    if (JSON.parse(window.localStorage.getItem('checkedOutHeaters')) !== null) {
      this.checkedOutRouteInstanceHeaters = JSON.parse(window.localStorage.getItem('checkedOutHeaters'));
    }

    if (JSON.parse(window.localStorage.getItem('tankHoseInteractionId')) !== null) {
      if (JSON.parse(window.localStorage.getItem('checkedOutHeaters')) !== null) {
        if (confirm('Please press OK to check in heating equipment at the end of the route or Cancel to continue checking out heaters.')) {
          this.isEndOfRoute = true;
        }
      }
      else {
        this.isEndOfRoute = true;
      }
      
      this.isInitialCheckout = false;
    }

    if (this.isInitialCheckout && !this.isEndOfRoute) {
      this.routeInstanceTankHoseForm = this.fb.group({
        number_heaters_out: '',
        number_tanks_out: '',
        number_hoses_out: ''
      });

      this.routeInstanceTankHoseForm.get('number_tanks_out').setValidators(Validators.required);
      this.routeInstanceTankHoseForm.get('number_hoses_out').setValidators(Validators.required);
    }

    if (!this.isInitialCheckout && this.isEndOfRoute) {
      this.routeInstanceTankHoseForm = this.fb.group({
        number_heaters_in: '',
        number_tanks_in: '',
        number_hoses_in: ''
      });

      this.routeInstanceTankHoseForm.get('number_tanks_in').setValidators(Validators.required);
      this.routeInstanceTankHoseForm.get('number_hoses_in').setValidators(Validators.required);
    }
  }

  next() {
    if (this.isInitialCheckout) {
      let routeInstanceTankHoseInteraction: RouteInstanceTankHoseInteraction = new RouteInstanceTankHoseInteraction();
      routeInstanceTankHoseInteraction.route_instance_id = JSON.parse(window.localStorage.getItem('routeInstance'));
      routeInstanceTankHoseInteraction.number_hoses_out = this.routeInstanceTankHoseForm.get('number_hoses_out').value;
      routeInstanceTankHoseInteraction.number_tanks_out = this.routeInstanceTankHoseForm.get('number_tanks_out').value;
      routeInstanceTankHoseInteraction.number_heaters_out = this.routeInstanceTankHoseForm.get('number_heaters_out').value;

      this.mainService.insertRouteInstanceTankHoseInteraction(routeInstanceTankHoseInteraction).subscribe((data: RouteInstanceTankHoseInteraction) => {
        window.localStorage.setItem('tankHoseInteractionId', JSON.stringify(data.id))
      }, error => console.log(error));

      this.router.navigate(['volunteerInfo']);
    }
    else {
      this.router.navigate(['route', JSON.parse(window.localStorage.getItem('routeId'))]);
    }
  }

  endRoute() {
    let routeInstanceTankHoseInteraction: RouteInstanceTankHoseInteraction = new RouteInstanceTankHoseInteraction();
    routeInstanceTankHoseInteraction.id = JSON.parse(window.localStorage.getItem('tankHoseInteractionId'));
    routeInstanceTankHoseInteraction.number_hoses_in = this.routeInstanceTankHoseForm.get('number_hoses_in').value;
    routeInstanceTankHoseInteraction.number_tanks_in = this.routeInstanceTankHoseForm.get('number_tanks_in').value;
    routeInstanceTankHoseInteraction.number_heaters_in = this.routeInstanceTankHoseForm.get('number_heaters_in').value;

    this.mainService.updateRouteInstanceTankHoseInteraction(routeInstanceTankHoseInteraction);

    let apiKey: string = window.localStorage.getItem('apiToken');
    window.localStorage.clear();
    window.localStorage.setItem('apiToken', apiKey);
    window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
    this.router.navigate(['login']);
  }
}
