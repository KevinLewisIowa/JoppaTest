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
  constructor(private router: Router, private mainService: MainService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.theRoute = new Route();
    let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
    this.mainService.getRoute(routeId).subscribe((route: Route) => {
      this.theRoute = route;
    }, error => console.log(error));

    this.theLocationCamp = new LocationCamp();
    this.locationCampForm = this.fb.group({
      is_active: true,
      name: '',
      notes: '',
      position: ''
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
    this.theLocationCamp.is_active = this.locationCampForm.get('is_active').value;
    this.theLocationCamp.notes = this.locationCampForm.get('notes').value;
    this.theLocationCamp.position = this.locationCampForm.get('position').value;
    this.mainService.insertLocationCamp(this.theLocationCamp).subscribe(data => {
      this.router.navigate([`route/${routeId}`]);
    }, error => {console.log(error)});
  }
}
