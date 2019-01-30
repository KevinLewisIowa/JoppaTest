import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Location } from '../models/location';
import { LocationCamp } from '../models/location-camp';

@Component({
  selector: 'app-create-location-camp',
  templateUrl: './create-location-camp.component.html',
  styleUrls: ['./create-location-camp.component.css']
})
export class CreateLocationCampComponent implements OnInit {
  theLocationCamp: LocationCamp;
  locationCampForm: FormGroup;
  location: Location;
  constructor(private router: Router, private mainService: MainService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.location = new Location();
    this.store.select('user').subscribe(data => {
      if (data != null && data.selectedLocation != null) {
        this.location = data.selectedLocation;
      } else {
        var locationId = window.localStorage.getItem('locationId');
        this.mainService.getRouteLocation(locationId).subscribe(data => {
          this.location = data;
          this.store.dispatch({type: 'LOCATION_SELECTED', payload: data})
        }, error => {this.store.dispatch({type: 'USER_API_ERROR', payload: {message: 'Error getting location'}})});
      }
    })
    this.theLocationCamp = new LocationCamp();
    this.locationCampForm = this.fb.group({
      is_active: true,
      name: ''
    });
    this.locationCampForm.get('name').setValidators(Validators.required);
  }

  back() {
    var locationId = window.localStorage.getItem('locationId');
    this.router.navigate([`location/${locationId}`]);
  }

  submitLocationCamp() {
    var locationId = window.localStorage.getItem('locationId');
    if (locationId == null) {
      this.router.navigate(['routes']);
    }
    this.theLocationCamp.location_id = Number(locationId);
    this.theLocationCamp.name = this.locationCampForm.get('name').value;
    this.theLocationCamp.is_active = this.locationCampForm.get('is_active').value;
    this.mainService.insertLocationCamp(this.theLocationCamp).subscribe(data => {
      this.router.navigate([`location/${locationId}`]);
    }, error => {this.store.dispatch({type: 'USER_API_ERROR', payload: {message: error.message}})});
  }
}
