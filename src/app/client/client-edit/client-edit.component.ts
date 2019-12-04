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
  isAdmin: boolean;

  constructor(private router: Router, private clientService: ClientService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.theClient = new Client();
    this.clientForm = this.fb.group({
      birth_date: '',
      first_name: '',
      last_name: '',
      preferred_name: '',
      is_aftercare: false,
      is_veteran: false,
      previous_camp_id: 0,
      current_camp_id: 0,
      shoe_size: '',
      boot_size: '',
      number_meals: 1,
      status: 'Active',
      phone: '',
      joppa_apartment_number: '',
      dwelling: '',
      gender: '',
      admin_notes: ''
    });
    this.clientForm.get('first_name').setValidators(Validators.required);
    this.clientForm.get('last_name').setValidators(Validators.required);
    this.clientForm.get('gender').setValidators(Validators.required);
    this.clientForm.get('dwelling').setValidators(Validators.required);
  }

  submitClient() {
    const locationCampId = JSON.parse(window.localStorage.getItem('locationCampId'));
    this.theClient.first_name = String(this.clientForm.get('first_name').value).trim();
    this.theClient.last_name = String(this.clientForm.get('last_name').value).trim();
    this.theClient.preferred_name = String(this.clientForm.get('preferred_name').value).trim();
    this.theClient.birth_date = new Date(Date.parse(this.clientForm.get('birth_date').value));
    this.theClient.is_aftercare = this.clientForm.get('is_aftercare').value;
    this.theClient.is_veteran = this.clientForm.get('is_veteran').value;
    this.theClient.current_camp_id = locationCampId;
    this.theClient.previous_camp_id = null;
    this.theClient.shoe_size = String(this.clientForm.get('shoe_size').value).trim();
    this.theClient.boot_size = String(this.clientForm.get('boot_size').value).trim();
    this.theClient.status = String(this.clientForm.get('status').value).trim();
    this.theClient.inactive_description = '';
    this.theClient.number_meals = this.clientForm.get('number_meals').value as number;
    this.theClient.phone = String(this.clientForm.get('phone').value).trim();
    this.theClient.joppa_apartment_number = String(this.clientForm.get('joppa_apartment_number').value).trim();
    this.theClient.dwelling = this.clientForm.get('dwelling').value;
    this.theClient.gender = this.clientForm.get('gender').value;
    this.theClient.admin_notes = String(this.clientForm.get('admin_notes').value).trim();
    this.clientService.insertClient(this.theClient).subscribe((data: Client) => {
      const clientInteraction: Appearance = new Appearance();
      clientInteraction.client_id = data.id;
      clientInteraction.location_camp_id = JSON.parse(locationCampId);
      clientInteraction.still_lives_here = true;

      this.clientService.insertClientAppearance(clientInteraction).subscribe(data => {
        this.router.navigate([`/locationCamp/${locationCampId}`]);
      });      
    }, error => {
      console.log(error);
      alert('Error creating client.  There may already be a client with the same name.  Please search for the client before continuing.');
    });
  }

  close() {
    const locationCampId = JSON.parse(window.localStorage.getItem('locationCampId'));
    this.router.navigate([`/locationCamp/${locationCampId}`]);
  }
}
