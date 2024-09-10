import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Inject, LOCALE_ID } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-client-edit-modal',
  templateUrl: './client-edit-modal.component.html',
  styleUrls: ['./client-edit-modal.component.css']
})
export class ClientEditModalComponent implements OnInit {
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
  extraInfoNeededReasonForDesMoines: boolean = false;
  submitted: boolean = false;
  staticBirthday: string = '';

  constructor(private router: Router, private modalService: NgbModal, private clientService: ClientService, private fb: UntypedFormBuilder, @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
    this.theClient = new Client();
    this.clientForm = this.fb.group(this.theClient);

    console.log('Is Veteran ' + this.theClient.diagnosed_mental_physical_disability);

    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  onReasonForDesMoinesChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeededReasonForDesMoines = true;
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
    this.clientForm = this.fb.group(this.theClient);
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
    console.log(value);
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
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        console.log(JSON.stringify(event.target.result));
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

    this.clientService.updateClient(updatedClient).subscribe(data => {
      this.editedClient.emit(updatedClient);
    }, error => {
      console.log(error);
      alert('Error creating client.  There may already be a client with the same name.  Please search for the client before continuing.');
    });
  }

}
