import { Component, OnInit, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { LocationCamp } from "app/models/location-camp";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";

@Component({
  selector: 'app-camp-edit-modal',
  templateUrl: './camp-edit-modal.component.html',
  styleUrls: ['./camp-edit-modal.component.css']
})
export class CampEditModalComponent implements OnInit {
  @ViewChild('editModal') editModal: ElementRef;
  @Output() editedCamp = new EventEmitter<LocationCamp>();
  badDate = false;
  campForm: FormGroup;
  regExpDate = /^\d{2}\/\d{2}\/\d{4}$/
  theCamp: LocationCamp;
  editing = false;


  constructor(private router: Router, private modalService: NgbModal, private service: MainService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.theCamp = new LocationCamp();
    this.campForm = this.fb.group(this.theCamp);
  }

  showModal(camp: LocationCamp) {
    this.theCamp = camp;
    this.campForm = null;
    this.campForm = this.fb.group(this.theCamp);
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static'});
  }

  toggleEditMode() {
    this.editing = !this.editing;
  }

  submitCamp() {
    this.service.updateLocationCamp(this.campForm.value as LocationCamp);
    this.editedCamp.emit(this.campForm.value as LocationCamp);
  }

}
