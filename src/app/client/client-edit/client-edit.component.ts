import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ClientService } from "app/services/client.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Client } from "app/models/client";
import { Appearance } from 'app/models/appearance';

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
      is_aftercare: false,
      is_veteran: false,
      previous_camp_id: 0,
      current_camp_id: 0,
      shoe_size: '',
      boot_size: '',
      number_meals: 0,
      phone: '',
      joppa_apartment_number: '',
      dwelling: ''
    });
    this.clientForm.get('preferred_name').setValidators(Validators.required);
    // this.clientForm.get('birthDate').setValidators(Validators.pattern(this.regExpDate));
  }

  submitRoute() {
    const locationCampId = window.sessionStorage.getItem('locationCampId');
    this.theClient.preferred_name = this.clientForm.get('preferred_name').value;
    this.theClient.birth_date = new Date(Date.parse(this.clientForm.get('birth_date').value));
    this.theClient.is_aftercare = this.clientForm.get('is_aftercare').value;
    this.theClient.is_veteran = this.clientForm.get('is_veteran').value;
    this.theClient.current_camp_id = null;
    this.theClient.previous_camp_id = null;
    this.theClient.shoe_size = this.clientForm.get('shoe_size').value;
    this.theClient.boot_size = this.clientForm.get('boot_size').value;
    this.theClient.inactive = false;
    this.theClient.deceased = false;
    this.theClient.inactive_description = '';
    this.theClient.number_meals = this.clientForm.get('number_meals').value as number;
    this.theClient.phone = this.clientForm.get('phone').value;
    this.theClient.joppa_apartment_number = this.clientForm.get('joppa_apartment_number').value;
    this.theClient.dwelling = this.clientForm.get('dwelling').value;
    this.clientService.insertClient(this.theClient).subscribe((data: Client) => {
      const clientInteraction: Appearance = new Appearance();
      clientInteraction.client_id = data.id;
      clientInteraction.location_camp_id = JSON.parse(locationCampId);
      clientInteraction.still_lives_here = true;
      
      this.clientService.insertClientAppearance(clientInteraction);

      this.router.navigate([`/locationCamp/${locationCampId}`]);
    }, error => { this.store.dispatch({type: 'USER_API_ERROR', payload: { message: 'error' }})});
  }

  back() {
    const locationCampId = JSON.parse(window.sessionStorage.getItem('locationCampId'));
    this.router.navigate([`/locationCamp/${locationCampId}`]);
  }
}
