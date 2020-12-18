import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ClientService } from "app/services/client.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Client } from "app/models/client";
import { Appearance } from 'app/models/appearance';
import { DatePipe } from '@angular/common';

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
  otherHomelessReason: string;
  homelessReasonOptions: string[] = ['Eviction', 'Job Loss', 'Family Dispute', 'Legal Issues', 'Health Issues', 'Addictions', 'Mental Health Issues', 'Other'];
  extraInfoNeeded: boolean = false;
  locationCampId: number;

  constructor(private router: Router, private clientService: ClientService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.locationCampId = JSON.parse(window.localStorage.getItem('locationCampId'))
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
      dwelling: 'Tent',
      gender: '',
      admin_notes: '',
      homeless_reason: '',
      first_time_homeless: null,
      date_became_homeless: '',
      due_to_covid: null
    });
    this.clientForm.get('first_name').setValidators(Validators.required);
    this.clientForm.get('last_name').setValidators(Validators.required);
    this.clientForm.get('gender').setValidators(Validators.required);
    this.clientForm.get('dwelling').setValidators(Validators.required);
    if (!this.isAdmin) {
      this.clientForm.get('first_time_homeless').setValidators(Validators.required);
      this.clientForm.get('date_became_homeless').setValidators(Validators.required);
      this.clientForm.get('homeless_reason').setValidators(Validators.required);
      this.clientForm.get('due_to_covid').setValidators(Validators.required);
    }

    //this.clientForm.get('birth_date').setValue(new Date());
  }

  onChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeeded = true;
    }
  }

  onFTHChange(value: string) {
    if (value == 'Unknown') {
      this.clientForm.patchValue({first_time_homeless: null});
    }
    else if (value == 'Yes') {
      this.clientForm.patchValue({first_time_homeless: true});
    }
    else {
      this.clientForm.patchValue({first_time_homeless: false});
    }
  }

  onDTCChange(value: string) {
    if (value == 'Unknown') {
      this.clientForm.patchValue({due_to_covid: null});
    }
    else if (value == 'Yes') {
      this.clientForm.patchValue({due_to_covid: true});
    }
    else {
      this.clientForm.patchValue({due_to_covid: false});
    }
  }

  submitClient() {
    this.theClient.first_name = String(this.clientForm.get('first_name').value).trim();
    this.theClient.last_name = String(this.clientForm.get('last_name').value).trim();
    this.theClient.preferred_name = String(this.clientForm.get('preferred_name').value).trim();
    this.theClient.birth_date = new Date(Date.parse(this.clientForm.get('birth_date').value));
    this.theClient.is_aftercare = this.clientForm.get('is_aftercare').value;
    this.theClient.is_veteran = this.clientForm.get('is_veteran').value;
    this.theClient.current_camp_id = this.locationCampId;
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
    this.theClient.first_time_homeless = this.clientForm.get('first_time_homeless').value;
    this.theClient.date_became_homeless = new Date(Date.parse(this.clientForm.get('date_became_homeless').value));
    let homelessReason = String(this.clientForm.get('homeless_reason').value.trim());
    if (homelessReason == 'Other' && this.otherHomelessReason != '') {
      homelessReason = this.otherHomelessReason;
    }
    else if (homelessReason == 'Other' && this.otherHomelessReason == '') {
      alert('If you select Other as Homeless Reason, need to indicate reason.');
      return;
    }
    this.theClient.homeless_reason = homelessReason;
    //this.theClient.due_to_covid = this.clientForm.get('due_to_covid').value;
    this.clientService.insertClient(this.theClient).subscribe((insertedClient: Client) => {
      const clientInteraction: Appearance = new Appearance();
      clientInteraction.client_id = insertedClient.id;
      clientInteraction.location_camp_id = this.locationCampId;
      clientInteraction.still_lives_here = true;

      this.clientService.insertClientAppearance(clientInteraction).subscribe(data => {
        insertedClient.household_id = insertedClient.id;
        this.clientService.updateClient(insertedClient).subscribe(updatedClient => {
          console.log(JSON.stringify(updatedClient));
          this.router.navigate([`/locationCamp/${this.locationCampId}`]);
        }, error => console.log(error));
      }, error => console.log(error));      
    }, error => {
      console.log(error);
      alert('Error creating client.  There may already be a client with the same name.  Please search for the client before continuing.');
    });
  }

  close() {
    this.router.navigate([`/locationCamp/${this.locationCampId}`]);
  }
}
