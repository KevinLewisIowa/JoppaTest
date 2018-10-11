import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MainService } from "app/services/main.service";
import { Store } from "@ngrx/store";
import { Location } from "app/models/location";
import { IMainStore } from "app/state-management/main.store";

@Component({
  selector: 'app-location-edit-modal',
  templateUrl: './location-edit-modal.component.html',
  styleUrls: ['./location-edit-modal.component.css']
})
export class LocationEditModalComponent implements OnInit {
@ViewChild('editModal') editModal: ElementRef;
  @Output() editedLocation = new EventEmitter<Location>();
  badDate = false;
  locationForm: FormGroup;
  theLocation: Location;
  editing = false;


  constructor(private router: Router, private modalService: NgbModal, private service: MainService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.theLocation = new Location();
    this.locationForm = this.fb.group(this.theLocation);
  }

  showModal(location: Location) {
    this.theLocation = location;
    this.locationForm = null;
    this.locationForm = this.fb.group(this.theLocation);
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static'});
  }

  toggleEditMode() {
    this.editing = !this.editing;
  }

  submitLocation() {
    this.service.updateLocation(this.locationForm.value as Location);
    this.editedLocation.emit(this.locationForm.value as Location);
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.locationForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
     });
  }
}
