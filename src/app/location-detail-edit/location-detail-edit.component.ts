import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Location } from '../models/location';
import { Route } from '../models/route';

@Component({
  selector: 'app-location-detail-edit',
  templateUrl: './location-detail-edit.component.html',
  styleUrls: ['./location-detail-edit.component.css']
})
export class LocationDetailEditComponent implements OnInit {
  theLocation: Location;
  locationForm: FormGroup;
  theRoute: Route;
  constructor(private router: Router, private mainService: MainService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.theRoute = new Route();
    this.store.select('user').subscribe(data => {
      if (data != null && data.selectedRoute != null) {
        this.theRoute = data.selectedRoute;
      } else {
        var routeId = window.localStorage.getItem('routeId');
        this.mainService.getRoute(routeId).subscribe(data => {
          this.theRoute = data;
          this.store.dispatch({type: 'ROUTE_SELECTED', payload: data})
        }, error => {this.store.dispatch({type: 'USER_API_ERROR', payload: {message: 'Error getting route'}})});
      }
    })
    this.theLocation = new Location();
    this.locationForm = this.fb.group({
      notes: '',
      position: '',
      is_active: true,
      name: ''
    });
    this.locationForm.get('notes').setValidators(Validators.required);
    this.locationForm.get('name').setValidators(Validators.required);
    this.locationForm.get('position').setValidators(Validators.required);
  }

  back() {
    var routeId = window.localStorage.getItem('routeId');
    this.router.navigate([`route/${routeId}`]);
  }

  submitLocation() {
    var routeId = window.localStorage.getItem('routeId');
    if (routeId == null) {
      this.router.navigate(['routes']);
    }
    this.theLocation.route_id = Number(routeId);
    this.theLocation.name = this.locationForm.get('name').value;
    this.theLocation.notes = this.locationForm.get('notes').value;
    this.theLocation.position = this.locationForm.get('position').value;
    this.theLocation.is_active = this.locationForm.get('is_active').value;
    this.mainService.insertLocation(this.theLocation).subscribe(data => {
      this.router.navigate([`route/${routeId}`]);
    }, error => {this.store.dispatch({type: 'USER_API_ERROR', payload: {message: error.message}})});
  }
}
