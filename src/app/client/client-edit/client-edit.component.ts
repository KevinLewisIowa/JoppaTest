import { AfterViewChecked, ChangeDetectorRef, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import heic2any from 'heic2any';
import { formatPhoneNumberValue } from 'app/utils/phone-utils';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ClientService } from "app/services/client.service";
import { CountryStateCityService } from "app/services/countrystatecity.service";
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
export class ClientEditComponent implements OnInit, AfterViewChecked {
  badDate = false;
  clientForm: UntypedFormGroup;
  theClient: Client;
  url: any;
  byteArray: any;
  // store object URL for preview to avoid data URL decoding issues
  private _objectUrl: string | null = null;
  isConverting: boolean = false;
  isAdmin: boolean;
  initialOtherReason: boolean = true;
  initialOtherDesMoines: boolean = true;
  locationCampId: number;
  //otherHomelessReason: string = '';
  extraInfoNeeded: boolean = false;
  extraInfoNeededReasonForDesMoines: boolean = false;
  homelessReasonOptions: string[] = [
    'Domestic Violence',
    'Eviction',
    'Family Dispute',
    'Family Loss',
    'Health Issue',
    'Job Loss',
    'Legal Issue',
    'Mental Health',
    'Natural Disaster',
    'Released from Prison/Jail',
    'Released from Hospital',
    'Released from Treatment',
    'Substance Abuse',
    'Other'
  ];
  
  constructor(private router: Router, private clientService: ClientService, private countryStateCityService: CountryStateCityService, private modalService: NgbModal, private fb: UntypedFormBuilder, @Inject(LOCALE_ID) private locale: string, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.locationCampId = JSON.parse(window.localStorage.getItem('locationCampId'))
    this.theClient = new Client();
    this.clientForm = this.fb.group({
      birth_date: '',
      first_name: '',
      middle_name: '',
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
      needs_translation: false,
      translation_language: '',
      other_translation_language: '',
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

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('otherHomelessReason');
      if (extraInfoElement && this.clientForm.get('otherHomelessReason').value == '' && this.initialOtherReason) {
        this.initialOtherReason = false;
        extraInfoElement.focus();
      }
    }
    if (this.extraInfoNeededReasonForDesMoines) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('otherReasonForDesMoines');
      if (extraInfoElement && this.clientForm.get('otherReasonForDesMoines').value == '' && this.initialOtherDesMoines) {
        this.initialOtherDesMoines = false;
        extraInfoElement.focus();
      }
    }
  }

  onChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeeded = true;
      this.initialOtherReason = true;
      console.log(this.clientForm.get('otherHomelessReason').value);
    } else {
      this.extraInfoNeeded = false;
      this.clientForm.patchValue({ otherHomelessReason: '' });
    }
  }

  onReasonForDesMoinesChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeededReasonForDesMoines = true;
      this.initialOtherDesMoines = true;
    } else {
      this.extraInfoNeededReasonForDesMoines = false;
      this.clientForm.patchValue({ otherReasonForDesMoines: '' });
    }
  }

  async onAdd(event: any) {
    if (!(event.target.files && event.target.files[0])) {
      this.url = null;
      this.byteArray = null;
      return;
    }
    const file: File = event.target.files[0];

    const processBlob = (blob: Blob) => {
      try {
        // revoke previous object URL
        if (this._objectUrl) {
          try { URL.revokeObjectURL(this._objectUrl); } catch (e) { /* ignore */ }
          this._objectUrl = null;
        }
        // create an object URL for reliable preview rendering
        this._objectUrl = URL.createObjectURL(blob);
        this.url = this._objectUrl;
      } catch (e) {
        // fallback to data URL path if createObjectURL not available
        console.warn('createObjectURL not available, falling back to data URL', e);
        this.url = null;
      }

      // always produce a base64 data payload for upload (async)
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        const result = ev.target.result as string;
        // if url not set above, set from data URL for preview
        if (!this.url) {
          this.url = result;
        }
        const parts = result.split('base64,');
        this.byteArray = parts.length > 1 ? parts[1] : '';
        // stop conversion indicator
        this.isConverting = false;
        try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
      };
      reader.readAsDataURL(blob);
    };

    const name = (file.name || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    const isHeic = type.includes('heic') || type.includes('heif') || name.endsWith('.heic') || name.endsWith('.heif');

    // start conversion indicator
    this.isConverting = true;
    if (isHeic) {
      try {
        const heicLib: any = (heic2any as any).default || heic2any;
        const converted: any = await heicLib({ blob: file, toType: 'image/jpeg', quality: 0.9 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        processBlob(blob);
      } catch (err: any) {
        console.error('HEIC conversion failed, falling back to original file', err);
        processBlob(file);
      }
    } else {
      processBlob(file);
    }
  }

  clearPicture() {
    this.byteArray = "";
    this.url = null;
    if (this._objectUrl) {
      try { URL.revokeObjectURL(this._objectUrl); } catch (e) { /* ignore */ }
      this._objectUrl = null;
    }
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
    this.theClient.middle_name = String(this.clientForm.get('middle_name').value).trim();
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

    const stateBeforeHomelessness = String(this.clientForm.get('state_before_homelessness').value).trim();
    const cityBeforeHomelessness = String(this.clientForm.get('city_before_homelessness').value).trim();

    const needsTranslation = this.clientForm.get('needs_translation').value;
    let translationLanguage = this.clientForm.get('translation_language').value;
    const otherTranslationLanguage = this.clientForm.get('other_translation_language').value;

    if (needsTranslation) {
      if (translationLanguage === 'Other' && otherTranslationLanguage) {
        translationLanguage = otherTranslationLanguage;
      }
      // Save translationLanguage to your client object or wherever needed
      this.theClient.translation_language = translationLanguage;
      this.theClient.needs_translation = true;
    } else {
      this.theClient.translation_language = '';
      this.theClient.needs_translation = false;
    }

    // Only check city and state if they have a value
    if (stateBeforeHomelessness && cityBeforeHomelessness) {
      this.countryStateCityService.getCitiesByCountryAndState(stateBeforeHomelessness).then((validCities: string[]) => {
        if (!validCities.includes(cityBeforeHomelessness) && cityBeforeHomelessness != 'Unknown' && cityBeforeHomelessness != 'Refused') {
          alert('Please enter a valid city before homelessness.');
          return;
        }

        this.theClient.state_before_homelessness = stateBeforeHomelessness;
        this.processClientSubmission();
      }, error => console.log(error));
    } else {
      // Skip city/state validation and proceed with submission
      this.processClientSubmission();
    }
  }

  private processClientSubmission() {
    let reason_for_des_moines: string = String(this.clientForm.get('what_brought_to_des_moines').value);
    let theOtherReasonForDesMoines: string = this.clientForm.get('otherReasonForDesMoines').value;
    if (reason_for_des_moines == 'Other' && theOtherReasonForDesMoines != '') {
      reason_for_des_moines = String(this.clientForm.get('otherReasonForDesMoines').value);
    } else if (reason_for_des_moines == 'Other' && theOtherReasonForDesMoines == '') {
      alert('If you select Other as what brought you to Des Moines, need to indicate reason.');
      return;
    }
    this.theClient.what_brought_to_des_moines = reason_for_des_moines;

    // Validate that client birth date is not unreasonable
    const birthDateStr = this.clientForm.get('birth_date').value;
    if (birthDateStr) {
      // Check MM/DD/YYYY format
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(birthDateStr)) {
        alert('Birth date must be in MM/DD/YYYY format.');
        return;
      }
      // Parse date
      const [month, day, year] = birthDateStr.split('/').map(Number);
      const birthday = new Date(year, month - 1, day);
      if (isNaN(birthday.getTime())) {
        alert('Invalid birth date.');
        return;
      }
      const now = new Date();
      const pastDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      if (birthday > now) {
        alert('You cannot select a birth date that is in the future');
        return;
      } else if (birthday < pastDate) {
        alert('You cannot set a birth date this far back in the past');
        return;
      }
      this.theClient.birth_date = birthday;
    }


    console.log("Submitting client: " + JSON.stringify(this.theClient));
    // Proceed with the rest of the client submission logic
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

            this.clientService.insertClientAppearance(clientInteraction).subscribe({
              next: (data: Appearance) => {
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
                this.clientService.insertClientHomelessHistory(theHistory).subscribe({
                  next: (data: ClientHomelessHistory) => {
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
                    this.clientService.insertClientDwelling(theDwelling).subscribe({
                      next: (data: ClientDwelling) => {
                        insertedClient.household_id = insertedClient.id;
                        this.clientService.updateClient(insertedClient).subscribe({
                          next: updatedClient => {
                            if (this.isAdmin && this.locationCampId === 449) {
                              this.router.navigate(['admin/clientListing']);
                            } else {
                              this.router.navigate([`/locationCamp/${this.locationCampId}`]);
                            }
                          },
                          error: error => console.log(error)
                        });
                      },
                      error: error => console.log(error)
                    });
                  },
                  error: error => console.log(error)
                });
              },
              error: error => console.log(error)
            });
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
      alert('Error creating client. There may already be a client with the same name. Please search for the client before continuing.');
    });
  }

  close() {
    if (this.locationCampId != 0) {
      this.router.navigate([`/locationCamp/${this.locationCampId}`]);
    } else {
      this.router.navigate(['admin/clientListing']);
    }
  }

  formatBirthDate() {
    const ctrl = this.clientForm.get('birth_date');
    if (!ctrl) return;
    let value = ctrl.value || '';
    // Remove all non-digits
    value = value.replace(/\D/g, '');
    // Insert slashes as needed
    if (value.length > 2 && value.length <= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length > 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
    if (ctrl.value !== value) {
      ctrl.setValue(value, { emitEvent: false });
    }
  }

  formatPhoneNumber() {
    const ctrl = this.clientForm.get('phone');
    if (!ctrl) return;
    let value = ctrl.value || '';
    const formatted = formatPhoneNumberValue(value);
    if (ctrl.value !== formatted) {
      ctrl.setValue(formatted, { emitEvent: false });
    }
  }
}
