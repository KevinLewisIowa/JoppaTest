import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { LocationCamp } from '../models/location-camp';
import { Route } from 'app/models/route';

@Component({
  selector: 'app-create-location-camp',
  templateUrl: './create-location-camp.component.html',
  styleUrls: ['./create-location-camp.component.css']
})
export class CreateLocationCampComponent implements OnInit {
  theLocationCamp: LocationCamp;
  locationCampForm: FormGroup;
  theRoute: Route;
  routes: Route[];
  isAdmin: boolean;
  constructor(private router: Router, private mainService: MainService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.theRoute = new Route();
    let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.mainService.getRoute(routeId).subscribe((route: Route) => {
      console.log(route);
      this.theRoute = route;
    }, error => console.log(error));

    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes;
    });

    this.theLocationCamp = new LocationCamp();
    this.locationCampForm = this.fb.group({
      name: '',
      notes: '',
      position: '',
      expected_arrival_time: '',
      remain_on_route: false
    });
    
    this.locationCampForm.get('name').setValidators(Validators.required);
    this.locationCampForm.get('position').setValidators(Validators.required);
  }

  back() {
    let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
    this.router.navigate([`route/${routeId}`]);
  }

  submitLocationCamp() {
    let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
    if (routeId == null) {
      this.router.navigate(['routes']);
    }
    this.theLocationCamp.route_id = Number(routeId);
    this.theLocationCamp.name = this.locationCampForm.get('name').value;
    this.theLocationCamp.is_active = true;
    this.theLocationCamp.notes = this.locationCampForm.get('notes').value;
    this.theLocationCamp.position = this.locationCampForm.get('position').value;
    this.theLocationCamp.expected_arrival_time = this.locationCampForm.get('expected_arrival_time').value;
    this.mainService.insertLocationCamp(this.theLocationCamp).subscribe(data => {
      console.log(data);
      this.router.navigate([`route/${routeId}`]);
    }, error => {console.log(error)});
  }
}
