import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { exit } from 'process';

@Component({
  selector: 'app-client-edit-modal',
  templateUrl: './client-edit-modal.component.html',
  styleUrls: ['./client-edit-modal.component.css']
})
export class ClientEditModalComponent implements OnInit {
  @ViewChild('editModal') editModal: ElementRef;
  @Output() editedClient = new EventEmitter<Client>();
  badDate = false;
  clientForm: FormGroup;
  regExpDate = /^\d{2}\/\d{2}\/\d{4}$/
  theClient: Client;
  firstTimeHomeless: string = 'Unknown';
  dueToCovid: string = 'Unknown';
  otherHomelessReason: string;
  editing = false;
  isAdmin: boolean;
  extraInfo: string = '';
  extraInfoNeeded: boolean = false;
  homelessReasonOptions: string[] = ['Eviction', 'Job Loss', 'Family Dispute', 'Legal Issues', 'Health Issues', 'Addictions', 'Mental Health Issues', 'Other'];

  constructor(private router: Router, private modalService: NgbModal, private clientService: ClientService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.theClient = new Client();
    this.clientForm = this.fb.group(this.theClient);
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  onChange(value: string) {
    if (value == 'Other') {
      this.extraInfoNeeded = true;
    }
  }

  onFTHChange(value: string) {
    this.firstTimeHomeless = value;
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
    this.dueToCovid = value;
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

  openModal(client: Client) {
    this.theClient = client;
    console.log(JSON.stringify(this.theClient));
    if (!this.homelessReasonOptions.includes(client.homeless_reason)) {
      this.homelessReasonOptions.push(client.homeless_reason);
    }

    if (this.theClient.first_time_homeless) {
      this.firstTimeHomeless = 'Yes';
    }
    else if (!this.theClient.first_time_homeless && this.theClient.first_time_homeless != null) {
      this.firstTimeHomeless = 'No';
    }

    if (this.theClient.due_to_covid) {
      this.dueToCovid = 'Yes';
    }
    else if (!this.theClient.due_to_covid && this.theClient.due_to_covid != null) {
      this.dueToCovid = 'No';
    }

    this.clientForm = null;
    this.clientForm = this.fb.group(this.theClient);
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static'});
  }

  toggleEditMode() {
    this.editing = !this.editing;
  }

  submitClient() {
    let updatedClient: Client = this.clientForm.value;

    let now: Date = new Date();
    let birthday: Date = new Date(updatedClient.birth_date);
    let pastDate: Date = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    if (birthday.getTime() > now.getTime()) {
      alert('You cannot select a birth date that is in the future');
      return;
    }
    else if (birthday.getTime() < pastDate.getTime()) {
      alert('You cannot set a birth date this far back in the past');
      return;
    }

    if (updatedClient.status == 'Inactive') {
      updatedClient.previous_camp_id = updatedClient.current_camp_id;
      updatedClient.current_camp_id = 0;
    }
    if (updatedClient.homeless_reason == 'Other' && this.otherHomelessReason != '') {
      updatedClient.homeless_reason = this.otherHomelessReason;
    }
    else if (updatedClient.homeless_reason == 'Other' && this.otherHomelessReason == '') {
      alert('If you select Other as Homeless Reason, need to indicate reason.');
      return;
    }

    this.clientService.updateClient(updatedClient).subscribe(data => {
      this.editedClient.emit(updatedClient);
    }, error => {
      console.log(error);
      alert('Error creating client.  There may already be a client with the same name.  Please search for the client before continuing.');
    });
  }

}
