import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Route } from '../models/route';
import { MainService } from '../services/main.service';
import { RouteInstance } from '../models/route-instance';

@Component({
  selector: 'app-leader-sign-in',
  templateUrl: './leader-sign-in.component.html',
  styleUrls: ['./leader-sign-in.component.css']
})
export class LeaderSignInComponent implements OnInit {
  routeInstanceForm: FormGroup;
  routes: Route[] = [];
  routeInstance: RouteInstance;

  constructor(private fb:FormBuilder, private mainService: MainService, private router: Router) { }

  ngOnInit() {
    this.routeInstanceForm = this.fb.group({
      leader_name: '',
      leader_phone: '',
      route_id: '',
      heat_route: true
    });

    this.routeInstanceForm.get('leader_name').setValidators(Validators.required);
    this.routeInstanceForm.get('route_id').setValidators(Validators.required);
    this.routeInstanceForm.get('leader_phone').setValidators(Validators.required);

    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes;
    })
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
    }, error => {console.log(error)});

    window.localStorage.setItem('heatRoute', this.routeInstanceForm.get('heat_route').value);
    window.localStorage.setItem('routeId', this.routeInstanceForm.get('route_id').value);
    window.localStorage.setItem('leaderName', this.routeInstanceForm.get('leader_name').value);

    //if (this.routeInstanceForm.get('heat_route').value) {
    //  this.router.navigate(['checkoutHeaters']);
    //}
    //else {
      this.router.navigate(['route', this.routeInstance.route_id]);
    //}
  }

}
