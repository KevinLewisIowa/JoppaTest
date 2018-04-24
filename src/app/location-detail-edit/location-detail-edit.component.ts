import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Location } from '../models/location';

@Component({
  selector: 'app-location-detail-edit',
  templateUrl: './location-detail-edit.component.html',
  styleUrls: ['./location-detail-edit.component.css']
})
export class LocationDetailEditComponent implements OnInit {
  theLocation: Location;
  locationForm: FormGroup;

  constructor(private router: Router, private mainService: MainService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
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

  submitLocation() {
    this.theLocation.name = this.locationForm.get('name').value;
    this.theLocation.position = this.locationForm.get('position').value;
    this.theLocation.is_active = this.locationForm.get('is_active').value;

    this.mainService.insertLocation(this.theLocation).subscribe(data => {
      var routeId = window.sessionStorage.getItem('routeId');
      this.router.navigate([`route/${routeId}`]);
    }, error => {this.store.dispatch({type: 'USER_API_ERROR', payload: {message: error.message}})});
  }
}
