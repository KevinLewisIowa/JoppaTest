import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ClientService } from "app/services/client.service";
import { Client } from "app/models/client";
import { Appearance } from 'app/models/appearance';
import { ClientDwelling } from 'app/models/client-dwelling';
import { ClientHomelessHistory } from 'app/models/client-homeless-histories';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DateSelectorComponent } from 'app/insert-modals/date-selector/date-selector.component';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {
  badDate = false;
  clientForm: UntypedFormGroup;
  theClient: Client;
  url: any;
  byteArray: any;
  isAdmin: boolean;
  locationCampId: number;
  //otherHomelessReason: string = '';
  extraInfoNeeded: boolean = false;
  extraInfoNeededReasonForDesMoines: boolean = false;
  homelessReasonOptions: string[] = ['Addictions', 'Eviction', 'Family Dispute', 'Family Loss', 'Health Issues', 'Job Loss', 'Legal Issues', 'Mental Health', 'Prison/Jail', 'Other'];

  constructor(private router: Router, private clientService: ClientService, private modalService: NgbModal, private fb: UntypedFormBuilder, @Inject(LOCALE_ID) private locale: string) { }

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
      is_veteran: null,
      previous_camp_id: 0,
      current_camp_id: 0,
      shoe_size: '',
      boot_size: '',
      number_meals: 1,
      status: 'Active',
      phone: '',
      email: '',
      joppa_apartment_number: '',
      gender: '',
      race: '',
      ethnicity: '',
      admin_notes: '',
      homeless_reason: '',
      otherHomelessReason: '',
      first_time_homeless: null,
      date_became_homeless: '',
      dwelling: 'Tent',
      dwelling_note: '',
      date_moved: '',
      client_picture: '',
      latitude: 0,
      longitude: 0,
      diagnosed_mental_physical_disability: null,
      highest_level_education: '',
      what_brought_to_des_moines: '',
      otherReasonForDesMoines: '',
      city_before_homelessness: '',
      state_before_homelessness: '',
      homeless_history_note: '',
      where_sleep_last_night: ''
    });
    this.clientForm.get('first_name').setValidators(Validators.required);
    this.clientForm.get('last_name').setValidators(Validators.required);
    this.clientForm.get('birth_date').setValidators(Validators.required);
    this.clientForm.get('gender').setValidators(Validators.required);
    this.clientForm.get('dwelling').setValidators(Validators.required);
    this.clientForm.get('city_before_homelessness').setValidators(Validators.required);
    this.clientForm.get('state_before_homelessness').setValidators(Validators.required);
  }

  onChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeeded = true;
      console.log(this.clientForm.get('otherHomelessReason').value);
    } else {
      this.extraInfoNeeded = false;
      this.clientForm.patchValue({ otherHomelessReason: '' });
    }
  }

  onReasonForDesMoinesChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeededReasonForDesMoines = true;
    } else {
      this.extraInfoNeededReasonForDesMoines = false;
      this.clientForm.patchValue({ otherReasonForDesMoines: '' });
    }
  }

  onAdd(event: any) {
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

  clearPicture() {
    this.byteArray = "";
    this.url = null;
  }

  onFTHChange(value: string) {
    if (value.toLowerCase() == 'unknown') {
      this.clientForm.patchValue({ first_time_homeless: null });
    }
    else if (value.toLowerCase() == 'yes') {
      this.clientForm.patchValue({ first_time_homeless: true });
    }
    else {
      this.clientForm.patchValue({ first_time_homeless: false });
    }
  }

  onVeteranChange(value: string) {
    if (value.toLowerCase() == 'null') {
      this.clientForm.patchValue({ is_veteran: null });
    }
    else if (value.toLowerCase() == 'true') {
      this.clientForm.patchValue({ is_veteran: true });
    }
    else {
      this.clientForm.patchValue({ is_veteran: false });
    }
  }

  onAftercareChange(value: string) {
    if (value.toLowerCase() == 'null') {
      this.clientForm.patchValue({ is_aftercare: null });
    }
    else if (value.toLowerCase() == 'true') {
      this.clientForm.patchValue({ is_aftercare: true });
    }
    else {
      this.clientForm.patchValue({ is_aftercare: false });
    }
  }

  onDiagnosedChange(value: string) {
    if (value.toLowerCase() == 'null') {
      this.clientForm.patchValue({ diagnosed_mental_physical_disability: null });
    }
    else if (value.toLowerCase() == 'true') {
      this.clientForm.patchValue({ diagnosed_mental_physical_disability: true });
    }
    else {
      this.clientForm.patchValue({ diagnosed_mental_physical_disability: false });
    }
  }

  convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.clientForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
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
    this.theClient.longitude = (this.clientForm.get('longitude').value == 0 ? undefined : this.clientForm.get('longitude').value);
    this.theClient.latitude = (this.clientForm.get('latitude').value == 0 ? undefined : this.clientForm.get('latitude').value);
    this.theClient.status = String(this.clientForm.get('status').value).trim();
    this.theClient.inactive_description = '';
    this.theClient.number_meals = this.clientForm.get('number_meals').value as number;
    this.theClient.phone = String(this.clientForm.get('phone').value).trim();
    this.theClient.email = String(this.clientForm.get('email').value).trim();
    this.theClient.joppa_apartment_number = String(this.clientForm.get('joppa_apartment_number').value).trim();
    this.theClient.gender = this.clientForm.get('gender').value;
    this.theClient.race = this.clientForm.get('race').value;
    this.theClient.ethnicity = this.clientForm.get('ethnicity').value;
    this.theClient.admin_notes = String(this.clientForm.get('admin_notes').value).trim();
    this.theClient.last_interaction_date = new Date();
    this.theClient.client_picture = this.byteArray;
    this.theClient.diagnosed_mental_physical_disability = this.clientForm.get('diagnosed_mental_physical_disability').value;
    this.theClient.highest_level_education = String(this.clientForm.get('highest_level_education').value).trim();
    this.theClient.city_before_homelessness = String(this.clientForm.get('city_before_homelessness').value).trim();
    this.theClient.state_before_homelessness = String(this.clientForm.get('state_before_homelessness').value).trim();

    let reason_for_des_moines: string = String(this.clientForm.get('what_brought_to_des_moines').value);
    let theOtherReasonForDesMoines: string = this.clientForm.get('otherReasonForDesMoines').value;
    if (reason_for_des_moines == 'Other' && theOtherReasonForDesMoines != '') {
      reason_for_des_moines = String(this.clientForm.get('otherReasonForDesMoines').value);
    }
    else if (reason_for_des_moines == 'Other' && theOtherReasonForDesMoines == '') {
      alert('If you select Other as what brought you to Des Moines, need to indicate reason.');
      return;
    }
    this.theClient.what_brought_to_des_moines = reason_for_des_moines;

    // validate that client birth date is not unreasonable
    if (this.theClient.birth_date) {
      let now: Date = new Date();
      let birthday: Date = new Date(this.theClient.birth_date);
      let pastDate: Date = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      if (birthday.getTime() > now.getTime()) {
        alert('You cannot select a birth date that is in the future');
        return;
      }
      else if (birthday.getTime() < pastDate.getTime()) {
        alert('You cannot set a birth date this far back in the past');
        return;
      }
    }

    this.clientService.insertClient(this.theClient).subscribe((insertedClient: Client) => {
      if (this.locationCampId == 0) {
        this.locationCampId = 449;
      }
      // create appearance of client as they were seen and serviced
      const clientInteraction: Appearance = new Appearance();
      clientInteraction.client_id = insertedClient.id;
      clientInteraction.location_camp_id = this.locationCampId;
      clientInteraction.still_lives_here = true;
      clientInteraction.serviced = true;
      clientInteraction.was_seen = true;
      // HRC true if Sunday
      clientInteraction.at_homeless_resource_center = new Date().getDay() !== 0;

      if (this.isAdmin) {
        // Allow them to select a Date
        const modalRef: NgbModalRef = this.modalService.open(
          DateSelectorComponent,
          {
            size: "lg",
            backdrop: "static",
          }
        );
        modalRef.result.then((selected_date: Date) => {
          if (!selected_date) {
            return;
          } else {
            clientInteraction.serviced_date = selected_date;

            this.clientService.insertClientAppearance(clientInteraction).subscribe((data: Appearance) => {
              let routeAttendanceList: Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
              clientInteraction.id = data.id;
              routeAttendanceList.push(clientInteraction);
              window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
              let reason_for_homelessness: string = this.clientForm.get('homeless_reason').value;
              let theOtherHomelessReason: string = this.clientForm.get('otherHomelessReason').value;
              if (reason_for_homelessness == 'Other' && theOtherHomelessReason != '') {
                reason_for_homelessness = theOtherHomelessReason;
              }
              else if (reason_for_homelessness == 'Other' && theOtherHomelessReason == '') {
                alert('If you select Other as Homeless Reason, need to indicate reason.');
                return;
              }

              const theHistory: ClientHomelessHistory = new ClientHomelessHistory();
              theHistory.reason_for_homelessness = reason_for_homelessness;
              theHistory.date_became_homeless = new Date(Date.parse(this.clientForm.get('date_became_homeless').value));
              theHistory.first_time_homeless = this.clientForm.get('first_time_homeless').value;
              theHistory.client_id = insertedClient.id;
              theHistory.note = this.clientForm.get('homeless_history_note').value;
              console.log(JSON.stringify(theHistory));
              this.clientService.insertClientHomelessHistory(theHistory).subscribe((data: ClientHomelessHistory) => {
                const theDwelling: ClientDwelling = new ClientDwelling();
                theDwelling.client_id = insertedClient.id;
                theDwelling.dwelling = String(this.clientForm.get('dwelling').value).trim();
                theDwelling.where_sleep_last_night = this.clientForm.get('where_sleep_last_night').value;
                if (this.clientForm.get('date_moved').value == '') {
                  theDwelling.date_moved = new Date();
                } else {
                  theDwelling.date_moved = new Date(this.clientForm.get('date_moved').value);
                }
                theDwelling.notes = this.clientForm.get('dwelling_note').value;
                this.clientService.insertClientDwelling(theDwelling).subscribe((data: ClientDwelling) => {
                  insertedClient.household_id = insertedClient.id;
                  this.clientService.updateClient(insertedClient).subscribe(updatedClient => {
                    if (this.isAdmin && this.locationCampId === 449) {
                      this.router.navigate(['admin/clientListing']);
                    } else {
                      this.router.navigate([`/locationCamp/${this.locationCampId}`]);
                    }
                  }, error => console.log(error));
                });
              }, error => console.log(error));
            }, error => console.log(error));
          }
        });
      }
      else {
        clientInteraction.serviced_date = new Date();

        this.clientService.insertClientAppearance(clientInteraction).subscribe((data: Appearance) => {
          let routeAttendanceList: Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
          clientInteraction.id = data.id;
          routeAttendanceList.push(clientInteraction);
          window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
          let reason_for_homelessness: string = this.clientForm.get('homeless_reason').value;
          let theOtherHomelessReason: string = this.clientForm.get('otherHomelessReason').value;
          if (reason_for_homelessness == 'Other' && theOtherHomelessReason != '') {
            reason_for_homelessness = theOtherHomelessReason;
          }
          else if (reason_for_homelessness == 'Other' && theOtherHomelessReason == '') {
            alert('If you select Other as Homeless Reason, need to indicate reason.');
            return;
          }

          const theHistory: ClientHomelessHistory = new ClientHomelessHistory();
          theHistory.reason_for_homelessness = reason_for_homelessness;
          theHistory.date_became_homeless = new Date(Date.parse(this.clientForm.get('date_became_homeless').value));
          theHistory.first_time_homeless = this.clientForm.get('first_time_homeless').value;
          theHistory.client_id = insertedClient.id;
          theHistory.note = this.clientForm.get('homeless_history_note').value;
          console.log(JSON.stringify(theHistory));
          this.clientService.insertClientHomelessHistory(theHistory).subscribe((data: ClientHomelessHistory) => {
            const theDwelling: ClientDwelling = new ClientDwelling();
            theDwelling.client_id = insertedClient.id;
            theDwelling.dwelling = String(this.clientForm.get('dwelling').value).trim();
            theDwelling.where_sleep_last_night = this.clientForm.get('where_sleep_last_night').value;
            if (this.clientForm.get('date_moved').value == '') {
              theDwelling.date_moved = new Date();
            } else {
              theDwelling.date_moved = new Date(this.clientForm.get('date_moved').value);
            }
            theDwelling.notes = this.clientForm.get('dwelling_note').value;
            this.clientService.insertClientDwelling(theDwelling).subscribe((data: ClientDwelling) => {
              insertedClient.household_id = insertedClient.id;
              this.clientService.updateClient(insertedClient).subscribe(updatedClient => {
                if (this.isAdmin && this.locationCampId === 449) {
                  this.router.navigate(['admin/clientListing']);
                } else {
                  this.router.navigate([`/locationCamp/${this.locationCampId}`]);
                }
              }, error => console.log(error));
            });
          }, error => console.log(error));
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
