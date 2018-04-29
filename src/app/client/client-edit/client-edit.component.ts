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
      birthDate: '',
      preferredName: '',
      isAfterCare: false,
      isVeteran: false,
      shoeSize: '',
      phone: '',
      joppaApartmentNumber: ''
    });
    this.clientForm.get('preferredName').setValidators(Validators.required);
    //this.clientForm.get('birthDate').setValidators(Validators.pattern(this.regExpDate));
  }

  submitRoute() {
    const locationId = window.sessionStorage.getItem('locationId');
    this.theClient.preferredName = this.clientForm.get('preferredName').value;
    this.theClient.birthDate = new Date(Date.parse(this.clientForm.get('birthDate').value));
    this.theClient.isAfterCare = this.clientForm.get('isAfterCare').value;
    this.theClient.isVeteran = this.clientForm.get('isVeteran').value;
    this.theClient.shoeSize = this.clientForm.get('shoeSize').value;
    this.theClient.phone = this.clientForm.get('phone').value;
    this.theClient.joppaApartmentNumber = this.clientForm.get('joppaApartmentNumber').value;
    console.log(this.theClient);
    this.clientService.insertClient(this.theClient).subscribe(data => {
      this.router.navigate([`/location/${locationId}`]);
    }, error => { this.store.dispatch({type: 'USER_API_ERROR', payload: { message: 'error' }})})
  }

  back() {
    const locationId = window.sessionStorage.getItem('locationId');
    this.router.navigate([`/location/${locationId}`]);
  }
}
