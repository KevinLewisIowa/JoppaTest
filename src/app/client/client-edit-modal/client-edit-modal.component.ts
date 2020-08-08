import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { IMainStore } from "app/state-management/main.store";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
  editing = false;
  isAdmin: boolean;

  constructor(private router: Router, private modalService: NgbModal, private clientService: ClientService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.theClient = new Client();
    this.clientForm = this.fb.group(this.theClient);
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  openModal(client: Client) {
    this.theClient = client;
    this.clientForm = null;
    this.clientForm = this.fb.group(this.theClient);
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static'});
  }

  toggleEditMode() {
    this.editing = !this.editing;
  }

  submitClient() {
    let updatedClient: Client = this.clientForm.value;
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
