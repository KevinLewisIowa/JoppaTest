import { Component, OnInit, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { LocationCamp } from "app/models/location-camp";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { Route } from 'app/models/route';

@Component({
  selector: 'app-camp-edit-modal',
  templateUrl: './camp-edit-modal.component.html',
  styleUrls: ['./camp-edit-modal.component.css']
})
export class CampEditModalComponent implements OnInit {
  @ViewChild('editModal', {static: false}) editModal: ElementRef;
  @Output() editedCamp = new EventEmitter<LocationCamp>();
  badDate = false;
  routes: Route[] = [];
  campForm: FormGroup;
  theCamp: LocationCamp;
  editing = false;
  isAdmin: boolean;

  constructor(private router: Router, private modalService: NgbModal, private mainService: MainService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.theCamp = new LocationCamp();
    this.campForm = this.fb.group(this.theCamp);
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));

    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  showModal(camp: LocationCamp) {
    this.theCamp = camp;
    this.campForm = null;
    this.campForm = this.fb.group(this.theCamp);
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static' });
  }

  toggleEditMode() {
    this.editing = !this.editing;
  }

  submitCamp() {
    console.log(this.campForm.value);
    this.mainService.updateLocationCamp(this.campForm.value as LocationCamp).subscribe(data => {
      window.localStorage.setItem('routeId', JSON.stringify(data.route_id));
      this.editedCamp.emit(this.campForm.value as LocationCamp);
    }, error => console.log(error));
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.campForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  }

}
