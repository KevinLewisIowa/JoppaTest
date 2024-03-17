import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Route } from '../models/route';
import { MainService } from '../services/main.service';
import { RouteInstance } from '../models/route-instance';
import { faChevronRight, faChevronLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-leader-sign-in',
  templateUrl: './leader-sign-in.component.html',
  styleUrls: ['./leader-sign-in.component.css']
})
export class LeaderSignInComponent implements OnInit {
  routeInstanceForm: UntypedFormGroup;
  routes: Route[] = [];
  routeInstance: RouteInstance;
  isAdmin = false;
  backIcon = faChevronLeft;
  forwardIcon = faChevronRight;
  signOutIcon = faSignOutAlt;

  constructor(private fb: UntypedFormBuilder, private mainService: MainService, private router: Router) { }

  ngOnInit() {
    const adminSetting = JSON.parse(window.localStorage.getItem('isAdmin'));
    if (adminSetting) {
      this.isAdmin = true;
      this.mainService.showAdminHome.next(adminSetting);
      this.router.navigate(['adminHome']);
    }
    if (JSON.parse(window.localStorage.getItem('routeInstance')) !== null) {
      let primary_device: boolean = JSON.parse(window.localStorage.getItem('primary_device'));
      if (primary_device) {
        this.mainService.showEndRoute.next(true);
      }
      
      if (JSON.parse(window.localStorage.getItem('heatRoute')) && (JSON.parse(window.localStorage.getItem('checkedOutHeaters')) == null || JSON.parse(window.localStorage.getItem('tankHoseInteractionId')) == null)) {
        this.router.navigate(['checkoutHeaters']);
      }
      else {
        if (JSON.parse(window.localStorage.getItem('routeId'))) {
          this.router.navigate(['route', JSON.parse(window.localStorage.getItem('routeId'))]);
        }
      }
    }
    else {
      this.mainService.showEndRoute.next(false);
    }

    this.mainService.showAdminHome.next(this.isAdmin);

    this.routeInstanceForm = this.fb.group({
      leader_name: '',
      leader_phone: '',
      scribe_name: '',
      scribe_phone: '',
      route_id: '',
      heat_route: false,
      primary_device: true
    });

    const phoneRegEx = /^[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    this.routeInstanceForm.get('leader_name').setValidators(Validators.required);
    this.routeInstanceForm.get('route_id').setValidators(Validators.required);
    this.routeInstanceForm.get('leader_phone').setValidators(Validators.compose([Validators.required, Validators.pattern(phoneRegEx)]));
    this.routeInstanceForm.get('scribe_name').setValidators(Validators.required);
    this.routeInstanceForm.get('scribe_phone').setValidators(Validators.compose([Validators.required, Validators.pattern(phoneRegEx)]));

    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  signOut() {
    window.localStorage.clear();
    this.mainService.showAdminHome.next(false);
    this.router.navigate(['/application-login']);
  }

  insertRouteInstance() {
    this.mainService.getActiveRouteInstanceForRoute(this.routeInstanceForm.get('route_id').value, this.routeInstanceForm.get('heat_route').value).subscribe(data => {
      console.log(JSON.stringify(data));

      // Calculate when it is a day after the last route started. If current date and time is before a day, then use the existing route.  Otherwise, create a new route.
      let day_after_route_start: Date = data[0].start_time;
      day_after_route_start.setDate(day_after_route_start.getDate() + 1);
      if (data.length > 0 && new Date(new Date().toUTCString()) <= day_after_route_start) {
        window.localStorage.setItem('routeInstance', data[0].id);
        window.localStorage.setItem('heatRoute', this.routeInstanceForm.get('heat_route').value);
        window.localStorage.setItem('routeId', this.routeInstanceForm.get('route_id').value);
        window.localStorage.setItem('primary_device', this.routeInstanceForm.get('primary_device').value)

        // Add end route button
        if (this.routeInstanceForm.get('primary_device').value) {
          this.mainService.showEndRoute.next(true);
        }

        this.router.navigate(['route', this.routeInstanceForm.get('route_id').value])
      } else {
        if (data.length > 0) {
          let route_instance_to_update: RouteInstance = data[0];
          route_instance_to_update.end_time = route_instance_to_update.start_time;
          this.mainService.updateRouteInstance(route_instance_to_update).subscribe(updatedRouteInstance => {
            // the route instance is now closed
          }, error => console.log(error));
        }

        this.routeInstance = new RouteInstance();
        this.routeInstance.heat_route = this.routeInstanceForm.get('heat_route').value;
        this.routeInstance.leader_name = this.routeInstanceForm.get('leader_name').value;
        this.routeInstance.leader_phone = this.routeInstanceForm.get('leader_phone').value;
        this.routeInstance.scribe_name = this.routeInstanceForm.get('scribe_name').value;
        this.routeInstance.scribe_phone = this.routeInstanceForm.get('scribe_phone').value;
        this.routeInstance.route_id = this.routeInstanceForm.get('route_id').value;
        this.routeInstance.start_time = new Date();
        this.mainService.insertRouteInstance(this.routeInstance).subscribe(new_data => {
          window.localStorage.setItem('routeInstance', new_data.id);
          window.localStorage.setItem('heatRoute', this.routeInstanceForm.get('heat_route').value);
          window.localStorage.setItem('routeId', this.routeInstanceForm.get('route_id').value);
          window.localStorage.setItem('primary_device', this.routeInstanceForm.get('primary_device').value)

          if (this.routeInstanceForm.get('heat_route').value) {
            this.router.navigate(['checkoutHeaters']);
          }
          else {
            this.router.navigate(['volunteerInfo']);
          }
        }, error => { console.log(error) });
      }
    }, error => console.log(error));
  }
}
