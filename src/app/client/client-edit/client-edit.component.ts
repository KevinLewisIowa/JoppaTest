import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ClientService } from "app/services/client.service";
import { Client } from "app/models/client";
import { Appearance } from 'app/models/appearance';
import { formatDate } from '@angular/common';
import { ClientDwelling } from 'app/models/client-dwelling';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {
  badDate = false;
  clientForm: FormGroup;
  regExpDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/
  theClient: Client;
  url: any;
  byteArray: any;
  isAdmin: boolean;
  locationCampId: number;
  //otherHomelessReason: string = '';
  extraInfoNeeded: boolean = false;
  homelessReasonOptions: string[] = ['Eviction', 'Job Loss', 'Family Dispute', 'Family Loss', 'Legal Issues', 'Health Issues', 'Addictions', 'Mental Health', 'Other'];

  constructor(private router: Router, private clientService: ClientService, private fb: FormBuilder, @Inject(LOCALE_ID) private locale: string) { }

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
      gender: '',
      admin_notes: '',
      homeless_reason: '',
      otherHomelessReason: '',
      first_time_homeless: null,
      date_became_homeless: '',
      dwelling: 'Tent',
      client_picture: ''
    });
    this.clientForm.get('first_name').setValidators(Validators.required);
    this.clientForm.get('last_name').setValidators(Validators.required);
    this.clientForm.get('gender').setValidators(Validators.required);
    this.clientForm.get('dwelling').setValidators(Validators.required);
  }

  onChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeeded = true;
    } else {
      this.extraInfoNeeded = false;
      this.clientForm.patchValue({ otherHomelessReason: '' });
    }
  }

  onAdd(event: any) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.byteArray = event.target.result.split('base64,')[1];
      }
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.url = null;
    }
  }

  onFTHChange(value: string) {
    if (value == 'Unknown') {
      this.clientForm.patchValue({ first_time_homeless: null });
    }
    else if (value == 'Yes') {
      this.clientForm.patchValue({ first_time_homeless: true });
    }
    else {
      this.clientForm.patchValue({ first_time_homeless: false });
    }
  }

  convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  submitClient() {
    this.theClient.first_name = String(this.clientForm.get('first_name').value).trim();
    this.theClient.last_name = String(this.clientForm.get('last_name').value).trim();
    this.theClient.preferred_name = String(this.clientForm.get('preferred_name').value).trim();
    this.theClient.birth_date = (this.clientForm.get('birth_date').value === "") ? undefined : new Date(Date.parse(this.clientForm.get('birth_date').value));
    this.theClient.is_aftercare = this.clientForm.get('is_aftercare').value;
    this.theClient.is_veteran = this.clientForm.get('is_veteran').value;
    this.theClient.current_camp_id = this.locationCampId;
    this.theClient.previous_camp_id = null;
    this.theClient.status = String(this.clientForm.get('status').value).trim();
    this.theClient.inactive_description = '';
    this.theClient.number_meals = this.clientForm.get('number_meals').value as number;
    this.theClient.phone = String(this.clientForm.get('phone').value).trim();
    this.theClient.joppa_apartment_number = String(this.clientForm.get('joppa_apartment_number').value).trim();
    this.theClient.gender = this.clientForm.get('gender').value;
    this.theClient.admin_notes = String(this.clientForm.get('admin_notes').value).trim();
    this.theClient.last_interaction_date = new Date();
    this.theClient.client_picture = this.byteArray;

    // validate that client birth date is not unreasonable
    if (this.theClient.birth_date) {
      if (!this.regExpDate.test(this.clientForm.get('birth_date').value)) {
        alert('Birth date must be entered in format mm/dd/yyyy');
        return;
      }

      let now: Date = new Date();
      let birthday: Date = new Date(this.theClient.birth_date);
      let pastDate: Date = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      if (!this.regExpDate.test(formatDate(birthday, 'MM/dd/yyyy', 'en'))) {
        
      }
      if (birthday.getTime() > now.getTime()) {
        alert('You cannot select a birth date that is in the future');
        return;
      }
      else if (birthday.getTime() < pastDate.getTime()) {
        alert('You cannot set a birth date this far back in the past');
        return;
      }
    }

    // validate that date became homeless is not unreasonable
    if (this.clientForm.get('date_became_homeless').value !== "") {
      if (!this.regExpDate.test(this.clientForm.get('date_became_homeless').value)) {
        alert('Date Became Homeless must be entered in format mm/dd/yyyy');
        return;
      }
    }

    this.clientService.insertClient(this.theClient).subscribe((insertedClient: Client) => {
      if (this.locationCampId == 0) {  
        let reason_for_homelessness : string = this.clientForm.get('homeless_reason').value;
        let theOtherHomelessReason: string = this.clientForm.get('otherHomelessReason').value;
        if (reason_for_homelessness == 'Other' && theOtherHomelessReason != '') {
          reason_for_homelessness = this.clientForm.get('otherHomelessReason').value;
        }
        else if (reason_for_homelessness == 'Other' && theOtherHomelessReason == '') {
          alert('If you select Other as Homeless Reason, need to indicate reason.');
          return;
        }
        
        const theDwelling: ClientDwelling = new ClientDwelling();
        theDwelling.client_id = insertedClient.id;
        theDwelling.dwelling = String(this.clientForm.get('dwelling').value).trim();
        theDwelling.homeless_reason = reason_for_homelessness;
        theDwelling.date_became_homeless = new Date(Date.parse(this.clientForm.get('date_became_homeless').value));
        theDwelling.first_time_homeless = this.clientForm.get('first_time_homeless').value;
        this.clientService.insertClientDwelling(theDwelling).subscribe((data: ClientDwelling) => {
          insertedClient.household_id = insertedClient.id;
          this.clientService.updateClient(insertedClient).subscribe(updatedClient => {
            if (this.locationCampId == 0) {
              this.router.navigate(['admin/clientListing']);
            } else {
              this.router.navigate([`/locationCamp/${this.locationCampId}`]);
            }
          }, error => console.log(error));
        });
      } else {
        // create appearance of client as they were seen and serviced
        const clientInteraction: Appearance = new Appearance();
        clientInteraction.client_id = insertedClient.id;
        clientInteraction.location_camp_id = this.locationCampId;
        clientInteraction.still_lives_here = true;
        clientInteraction.serviced = true;
        clientInteraction.was_seen = true;
        if (this.locationCampId == 0) {
          clientInteraction.at_homeless_resource_center = true;
        }

        this.clientService.insertClientAppearance(clientInteraction).subscribe((data: Appearance) => {
          // if during route, add this interaction to route interaction list
          if (!this.isAdmin) {
            let routeAttendanceList: Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
            clientInteraction.id = data.id;
            routeAttendanceList.push(clientInteraction);
            window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
          }
  
          let reason_for_homelessness : string = this.clientForm.get('homeless_reason').value;
          let theOtherHomelessReason: string = this.clientForm.get('otherHomelessReason').value;
          if (reason_for_homelessness == 'Other' && theOtherHomelessReason != '') {
            reason_for_homelessness = this.clientForm.get('otherHomelessReason').value;
          }
          else if (reason_for_homelessness == 'Other' && theOtherHomelessReason == '') {
            alert('If you select Other as Homeless Reason, need to indicate reason.');
            return;
          }
          
          const theDwelling: ClientDwelling = new ClientDwelling();
          theDwelling.client_id = insertedClient.id;
          theDwelling.dwelling = String(this.clientForm.get('dwelling').value).trim();
          theDwelling.homeless_reason = reason_for_homelessness;
          theDwelling.date_became_homeless = new Date(Date.parse(this.clientForm.get('date_became_homeless').value));
          theDwelling.first_time_homeless = this.clientForm.get('first_time_homeless').value;
          this.clientService.insertClientDwelling(theDwelling).subscribe((data: ClientDwelling) => {
            insertedClient.household_id = insertedClient.id;
            this.clientService.updateClient(insertedClient).subscribe(updatedClient => {
              if (this.locationCampId == 0) {
                this.router.navigate(['admin/clientListing']);
              } else {
                this.router.navigate([`/locationCamp/${this.locationCampId}`]);
              }
            }, error => console.log(error));
          });
        }, error => console.log(error));
      }
    }, error => {
      console.log(error);
      alert('Error creating client.  There may already be a client with the same name.  Please search for the client before continuing.');
    });
  }

  close() {
    if (this.locationCampId != 0) {
      this.router.navigate([`/locationCamp/${this.locationCampId}`]);
    } else {
      this.router.navigate(['admin/clientListing']);
    }
  }
}
