import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Inject, LOCALE_ID, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import heic2any from 'heic2any';
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { formatDate } from '@angular/common';
import { CountryStateCityService } from 'app/services/countrystatecity.service';
import { formatPhoneNumberValue } from 'app/utils/phone-utils';

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
  private _objectUrl: string | null = null;
  initialOther: boolean = true;
  extraInfoNeededReasonForDesMoines: boolean = false;
  submitted: boolean = false;
  staticBirthday: string = '';
  isConverting: boolean = false;
  whatbroughtyoutodesmoines: string[] = [
    'Better Homeless Services',
    'Didn’t Share',
    'Family',
    'Fresh Start',
    'Friend',
    'From Des Moines',
    'School',
    'Significant Other',
    'Treatment',
    'Work/Job',
    'Other'
  ];

  languages: string[] = [
    'Amharic',
    'Arabic',
    'Armenian',
    'Bengali',
    'Bosnian',
    'Bulgarian',
    'Burmese',
    'Cambodian',
    'Cantonese (Simplified)',
    'Cantonese (Traditional)',
    'Catalan',
    'Croatian',
    'Czech',
    'Danish',
    'Dari',
    'Dutch',
    'Estonian',
    'Finnish',
    'French',
    'German',
    'Greek',
    'Gniarati',
    'Haitian Creole',
    'Hebrew',
    'Hindi',
    'Hmong',
    'Hungarian',
    'Icelandic',
    'Ilocano',
    'Indonesian',
    'Italian',
    'Japanese',
    'Kackchiquel',
    'Korean',
    'Kurdish (General)',
    'Kurdish (Kurmanci)',
    'Latvian',
    'Lithuanian',
    'Mam',
    'Mandarin (Simplified)',
    'Mandarin (Traditional)',
    'Mon',
    'Norwegian',
    'Persian',
    'Polish',
    'Portuguese (Brazil)',
    'Portuguese (Portugal)',
    'Punjabi',
    'Qanjobal',
    'Quiche',
    'Romanian',
    'Russian',
    'Serbian',
    'Sign Language',
    'Slovak',
    'Slovenian',
    'Somali',
    'Spanish',
    'Swahili',
    'Swedish',
    'Tagalog',
    'Tamil',
    'Thai',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Vietnamese',
    'Welsh',
    'Xhosa',
    'Yiddish',
    'Yoruba',
    'Zulu'
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
    } else if (!this.theClient.first_time_homeless && this.theClient.first_time_homeless != null) {
      this.firstTimeHomeless = 'No';
    }

    this.clientForm = null;
    const whatBroughtToDesMoines = this.theClient.what_brought_to_des_moines || '';
    console.log('What brought to Des Moines:', whatBroughtToDesMoines);
    // Determine if the reason is known or should be set to "Other"
    const isKnownReason = this.whatbroughtyoutodesmoines.includes(whatBroughtToDesMoines);

    const translation_language = this.theClient.translation_language || '';
    const isKnownLanguage = this.languages.includes(translation_language);

    this.clientForm = this.fb.group({
      id: [this.theClient.id || undefined],
      first_name: [this.theClient.first_name || ''],
      middle_name: [this.theClient.middle_name || ''],
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
      what_brought_to_des_moines: [whatBroughtToDesMoines === '' ? '' : (isKnownReason ? whatBroughtToDesMoines : 'Other')],
      otherReasonForDesMoines: [whatBroughtToDesMoines !== '' && !isKnownReason ? whatBroughtToDesMoines : ''],
      needs_translation: [this.theClient.needs_translation || false],
      translation_language: [translation_language === '' ? '' : (isKnownLanguage ? translation_language : 'Other')],
      other_translation_language: [translation_language !== '' && !isKnownLanguage ? translation_language : '']
    });

    if (!isKnownReason && whatBroughtToDesMoines !== '') {
      this.extraInfoNeededReasonForDesMoines = true;
    }

    this.clientForm.patchValue({ birth_date: formatDate(this.clientForm.get('birth_date').value, 'MM/dd/yyyy', 'en') });

    // if (this.submitted) {
    //   // Handle if user re-visits the modal before page refresh and UTC auto-adjustment
    //   this.clientForm.patchValue({ birth_date: this.clientForm.get('birth_date').value });
    // } else {
    //   this.clientForm.patchValue({ birth_date: formatDate(this.clientForm.get('birth_date').value, 'yyyy-MM-dd', 'en') });
    // }
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

  async onAdd(event: any) {
    if (!(event.target.files && event.target.files[0])) {
      this.url = null;
      this.byteArray = null;
      return;
    }
    const file: File = event.target.files[0];

    const processBlob = (blob: Blob) => {
      // revoke previous object URL
      if (this._objectUrl) {
        try { URL.revokeObjectURL(this._objectUrl); } catch (e) { /* ignore */ }
        this._objectUrl = null;
      }
      try {
        this._objectUrl = URL.createObjectURL(blob);
        this.url = this._objectUrl;
        // ensure Angular picks up the async change
        try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
      } catch (e) {
        console.warn('client-edit-modal createObjectURL failed, falling back to data URL', e);
        this.url = null;
      }

      const reader = new FileReader();
      reader.onload = (ev: any) => {
        const result = ev.target.result as string;
        if (!this.url) this.url = result;
        const parts = result.split('base64,');
        this.byteArray = parts.length > 1 ? parts[1] : '';
        // stop conversion indicator
        this.isConverting = false;
        // ensure Angular updates bindings after FileReader completes
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

  submitClient() {
    let updatedClient: Client = this.clientForm.value;
    updatedClient.client_picture = this.byteArray;

    const stateBeforeHomelessness = String(this.clientForm.get('state_before_homelessness').value).trim();
    const cityBeforeHomelessness = String(this.clientForm.get('city_before_homelessness').value).trim();

    // Only check city and state if they have a value
    if (stateBeforeHomelessness && cityBeforeHomelessness) {
      this.cscService.getCitiesByCountryAndState(stateBeforeHomelessness).then((validCities: string[]) => {
        console.log(cityBeforeHomelessness);
        console.log(JSON.stringify(validCities));
        if (!validCities.includes(cityBeforeHomelessness) && cityBeforeHomelessness != 'Unknown' && cityBeforeHomelessness != 'Refused') {
          alert('Please enter a valid city before homelessness.');
          return;
        }

        this.processClientSubmission(updatedClient);
      }, error => console.log(error));
    } else {
      // Skip city/state validation and proceed with submission
      this.processClientSubmission(updatedClient);
    }
  }

  private processClientSubmission(updatedClient: Client) {
    let now: Date = new Date();
    const birthDateStr = this.clientForm.get('birth_date').value;
    if (!birthDateStr || birthDateStr.trim() === '') {
      alert('Birthday not fully entered');
      return;
    }
    // MM/DD/YYYY format check
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
    let pastDate: Date = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    if (birthday > now) {
      alert('You cannot select a birth date that is in the future');
      return;
    } else if (birthday < pastDate) {
      alert('You cannot set a birth date this far back in the past');
      return;
    }
    updatedClient.birth_date = birthday;
    this.staticBirthday = birthDateStr;
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

    if (
      updatedClient.needs_translation &&
      updatedClient.translation_language === 'Other' &&
      !this.clientForm.get('other_translation_language').value
    ) {
      alert('Please specify the language for translation.');
      return;
    }

    if (updatedClient.needs_translation) {
      if (updatedClient.translation_language === 'Other') {
        updatedClient.translation_language = this.clientForm.get('other_translation_language').value;
      }
    } else {
      updatedClient.translation_language = '';
    }

    this.clientService.updateClient(updatedClient).subscribe({
      next: (data) => {
        console.log(data);
        this.editedClient.emit(updatedClient);
      },
      error: (error) => {
        console.log(error);
        alert('Error creating client. There may already be a client with the same name. Please search for the client before continuing.');
      }
    });
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
