import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Inject, LOCALE_ID, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { formatDate } from '@angular/common';
import { CountryStateCityService } from 'app/services/countrystatecity.service';

@Component({
  selector: 'app-client-edit-modal',
  templateUrl: './client-edit-modal.component.html',
  styleUrls: ['./client-edit-modal.component.css']
})
export class ClientEditModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('editModal', { static: false }) editModal: ElementRef;
  @Output() editedClient = new EventEmitter<Client>();
  badDate = false;
  clientForm: UntypedFormGroup;
  theClient: Client;
  firstTimeHomeless: string = 'Unknown';
  editing = false;
  isAdmin: boolean;
  url: any;
  byteArray: any;
  initialOther: boolean = true;
  extraInfoNeededReasonForDesMoines: boolean = false;
  submitted: boolean = false;
  staticBirthday: string = '';
  whatbroughtyoutodesmoines: string[] = [
    'Better Homeless Services',
    'Family',
    'Friend',
    'From Des Moines',
    'School',
    'Work/Job',
    'Other'
  ];

  constructor(private router: Router, private modalService: NgbModal, private clientService: ClientService, private fb: UntypedFormBuilder, private cscService: CountryStateCityService, @Inject(LOCALE_ID) private locale: string, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeededReasonForDesMoines) {
      this.cdr.detectChanges();
      setTimeout(() => {
        const extraInfoElement = document.getElementById('otherReasonForDesMoines');
        if (extraInfoElement && this.clientForm.get('otherReasonForDesMoines').value == '' && this.initialOther) {
          extraInfoElement.focus();
          this.initialOther = false;
        }
      }, 0);
    }
  }

  onReasonChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeededReasonForDesMoines = true;
      this.initialOther = true;
    } else {
      this.extraInfoNeededReasonForDesMoines = false;
      this.clientForm.patchValue({ otherReasonForDesMoines: '' });
    }
  }

  openModal(client: Client) {
    this.theClient = client;

    if (this.theClient.client_picture != '' && this.theClient.client_picture != null) {
      this.url = 'data:image/png;base64,' + this.theClient.client_picture;
    }

    if (this.theClient.first_time_homeless) {
      this.firstTimeHomeless = 'Yes';
    }
    else if (!this.theClient.first_time_homeless && this.theClient.first_time_homeless != null) {
      this.firstTimeHomeless = 'No';
    }

    this.clientForm = null;
    const whatBroughtToDesMoines = this.theClient.what_brought_to_des_moines || '';
    const isKnownReason = this.whatbroughtyoutodesmoines.includes(whatBroughtToDesMoines);
    this.clientForm = this.fb.group({
      id: [this.theClient.id || undefined],
      first_name: [this.theClient.first_name || ''],
      last_name: [this.theClient.last_name || ''],
      preferred_name: [this.theClient.preferred_name || ''],
      birth_date: [this.theClient.birth_date || undefined],
      is_aftercare: [this.theClient.is_aftercare || false],
      shoe_size: [this.theClient.shoe_size || ''],
      boot_size: [this.theClient.boot_size || ''],
      phone: [this.theClient.phone || ''],
      email: [this.theClient.email || ''],
      status: [this.theClient.status || ''],
      is_veteran: [this.theClient.is_veteran || false],
      inactive_description: [this.theClient.inactive_description || ''],
      number_meals: [this.theClient.number_meals || undefined],
      joppa_apartment_number: [this.theClient.joppa_apartment_number || ''],
      dwelling: [this.theClient.dwelling || ''],
      created_at: [this.theClient.created_at || undefined],
      updated_at: [this.theClient.updated_at || undefined],
      last_interaction_date: [this.theClient.last_interaction_date || undefined],
      gender: [this.theClient.gender || ''],
      race: [this.theClient.race || ''],
      ethnicity: [this.theClient.ethnicity || ''],
      admin_notes: [this.theClient.admin_notes || ''],
      current_camp_id: [this.theClient.current_camp_id || undefined],
      previous_camp_id: [this.theClient.previous_camp_id || undefined],
      number_tanks: [this.theClient.number_tanks || undefined],
      number_hoses: [this.theClient.number_hoses || undefined],
      household_id: [this.theClient.household_id || undefined],
      first_time_homeless: [this.theClient.first_time_homeless || false],
      date_became_homeless: [this.theClient.date_became_homeless || undefined],
      homeless_reason: [this.theClient.homeless_reason || ''],
      due_to_covid: [this.theClient.due_to_covid || false],
      household_relationship_type: [this.theClient.household_relationship_type || ''],
      client_picture: [this.theClient.client_picture || undefined],
      latitude: [this.theClient.latitude || undefined],
      longitude: [this.theClient.longitude || undefined],
      has_location: [this.theClient.has_location || undefined],
      diagnosed_mental_physical_disability: [this.theClient.diagnosed_mental_physical_disability || false],
      highest_level_education: [this.theClient.highest_level_education || ''],
      city_before_homelessness: [this.theClient.city_before_homelessness || ''],
      state_before_homelessness: [this.theClient.state_before_homelessness || ''],
      what_brought_to_des_moines: [isKnownReason ? whatBroughtToDesMoines : 'Other'],
      otherReasonForDesMoines: [!isKnownReason ? whatBroughtToDesMoines : '']
    });

    if (!isKnownReason) {
      this.extraInfoNeededReasonForDesMoines = true;
    }
    if (this.submitted) {
      // handling if user re-visits the modal before page refresh and UTC auto-adjustment
      this.clientForm.patchValue({ birth_date: this.staticBirthday });
    }
    else {
      this.clientForm.patchValue({ birth_date: formatDate(this.clientForm.get('birth_date').value, 'yyyy-MM-dd', 'en') })
    }
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static' });
  }

  toggleEditMode() {
    this.editing = !this.editing;
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.clientForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
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

  submitClient() {
    let updatedClient: Client = this.clientForm.value;
    updatedClient.client_picture = this.byteArray;

    this.cscService.getCitiesByCountryAndState(String(this.clientForm.get('state_before_homelessness').value).trim()).then((validCities: string[]) => {
      const cityBeforeHomelessness = String(this.clientForm.get('city_before_homelessness').value).trim();
      console.log(cityBeforeHomelessness);
      console.log(JSON.stringify(validCities));
      if (!validCities.includes(cityBeforeHomelessness) && cityBeforeHomelessness != 'Unknown' && cityBeforeHomelessness != 'Refused') {
        alert('Please enter a valid city before homelessness.');
        return;
      }

      let now: Date = new Date();
      if (updatedClient.birth_date.toString() === '') {
        alert('Birthday not fully entered');
        return;
      }

      this.staticBirthday = this.clientForm.get('birth_date').value
      let birthday: Date = new Date((Date.parse(this.staticBirthday)));
      let pastDate: Date = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      if (birthday.getTime() > now.getTime()) {
        alert('You cannot select a birth date that is in the future');
        return;
      }
      else if (birthday.getTime() < pastDate.getTime()) {
        alert('You cannot set a birth date this far back in the past');
        return;
      }
      updatedClient.birth_date = birthday;
      this.submitted = true;

      if (updatedClient.status == 'Inactive') {
        updatedClient.previous_camp_id = updatedClient.current_camp_id;
        updatedClient.current_camp_id = 0;
      }

      if (updatedClient.what_brought_to_des_moines == 'Other' && this.clientForm.get('otherReasonForDesMoines').value == '') {
        alert('Please enter what brought you to Des Moines');
        return;
      } else if (updatedClient.what_brought_to_des_moines == 'Other' && this.clientForm.get('otherReasonForDesMoines').value != '') {
        updatedClient.what_brought_to_des_moines = this.clientForm.get('otherReasonForDesMoines').value;
      }

      this.clientService.updateClient(updatedClient).subscribe({
        next: (data) => {
          this.editedClient.emit(updatedClient);
        },
        error: (error) => {
          console.log(error);
          alert('Error creating client.  There may already be a client with the same name.  Please search for the client before continuing.');
        }
      });
    }, error => console.log(error));
  }

}
