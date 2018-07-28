import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ClientService } from "app/services/client.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Client } from "app/models/client";

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {
  badDate = false;
  clientForm: FormGroup;
  regExpDate = /^\d{2}\/\d{2}\/\d{4}$/
  theClient: Client;


  constructor(private router: Router, private clientService: ClientService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.theClient = new Client();
    this.clientForm = this.fb.group({
      birth_date: '',
      preferred_name: '',
      is_after_care: false,
      is_veteran: false,
      shoe_size: '',
      boot_size: '',
      phone: '',
      joppa_apartment_number: ''
    });
    this.clientForm.get('preferredName').setValidators(Validators.required);
    //this.clientForm.get('birthDate').setValidators(Validators.pattern(this.regExpDate));
  }

  submitRoute() {
    const locationCampId = window.sessionStorage.getItem('locationCampId');
    this.theClient.preferred_name = this.clientForm.get('preferred_name').value;
    this.theClient.birth_date = new Date(Date.parse(this.clientForm.get('birth_date').value));
    this.theClient.is_after_care = this.clientForm.get('is_after_care').value;
    this.theClient.is_veteran = this.clientForm.get('is_veteran').value;
    this.theClient.shoe_size = this.clientForm.get('shoe_size').value;
    this.theClient.phone = this.clientForm.get('phone').value;
    this.theClient.joppa_apartment_number = this.clientForm.get('joppa_apartment_number').value;
    this.clientService.insertClient(this.theClient).subscribe(data => {
      this.router.navigate([`/locationCamp/${locationCampId}`]);
    }, error => { this.store.dispatch({type: 'USER_API_ERROR', payload: { message: 'error' }})})
  }

  back() {
    const locationId = window.sessionStorage.getItem('locationId');
    this.router.navigate([`/location/${locationId}`]);
  }
}
