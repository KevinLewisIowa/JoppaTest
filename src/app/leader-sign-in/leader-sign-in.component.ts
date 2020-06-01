import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  routeInstanceForm: FormGroup;
  routes: Route[] = [];
  routeInstance: RouteInstance;
  isAdmin = false;
  backIcon = faChevronLeft;
  forwardIcon = faChevronRight;
  signOutIcon = faSignOutAlt;

  constructor(private fb:FormBuilder, private mainService: MainService, private router: Router) { }

  ngOnInit() {
    const adminSetting = JSON.parse(window.localStorage.getItem('isAdmin'));
    if (adminSetting) {
      this.isAdmin = true;
      this.mainService.showAdminHome.next(adminSetting);
    }
    if (JSON.parse(window.localStorage.getItem('routeInstance')) !== null) {
      this.mainService.showEndRoute.next(true);
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
      route_id: '',
      heat_route: false
    });

    const phoneRegEx = /^[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    this.routeInstanceForm.get('leader_name').setValidators(Validators.required);
    this.routeInstanceForm.get('route_id').setValidators(Validators.required);
    this.routeInstanceForm.get('leader_phone').setValidators(Validators.compose([Validators.required, Validators.pattern(phoneRegEx)]));

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
    this.routeInstance = new RouteInstance();
    this.routeInstance.heat_route = this.routeInstanceForm.get('heat_route').value;
    this.routeInstance.leader_name = this.routeInstanceForm.get('leader_name').value;
    this.routeInstance.leader_phone = this.routeInstanceForm.get('leader_phone').value;
    this.routeInstance.route_id = this.routeInstanceForm.get('route_id').value;
    this.routeInstance.start_time = new Date();
    this.mainService.insertRouteInstance(this.routeInstance).subscribe(data => {
      window.localStorage.setItem('routeInstance', data.id);
      window.localStorage.setItem('heatRoute', this.routeInstanceForm.get('heat_route').value);
      window.localStorage.setItem('routeId', this.routeInstanceForm.get('route_id').value);
      window.localStorage.setItem('leaderName', this.routeInstanceForm.get('leader_name').value);

      if (this.routeInstanceForm.get('heat_route').value) {
        this.router.navigate(['checkoutHeaters']);
      }
      else {
        this.router.navigate(['volunteerInfo']);
      }
    }, error => {console.log(error)});
  }
}
