import { Component, ViewChild, Output, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Caseworker } from '../../models/caseworker';

@Component({
  selector: 'app-client-caseworker',
  templateUrl: './client-caseworker.component.html',
  styleUrls: ['./client-caseworker.component.css']
})
export class ClientCaseworkerComponent implements OnInit {
  @ViewChild('clientCaseworkerMdl', { static: false }) clientCaseworkerMdl: ElementRef;
  @Output() caseworkerAdded = new EventEmitter<Caseworker>();

  organization: string = '';
  name: string = '';
  phoneNumber: string = '';
  emailAddress: string = '';
  notes: string = '';

  organizations: string[] = [
    'Anawim',
    'Aging Resources',
    'Broadlawns',
    'Community Support Advocate',
    'DHS',
    'Eyerly Ball',
    'Iowa Total Care',
    'Molina',
    'Primary Health Care',
    'Wellshare',
    'Wellpoint',
    'YMCA Supportive Housing',
    'Other'
  ];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    // Any initialization logic if needed
  }

  showModal() {
    this.modalService.open(this.clientCaseworkerMdl, { size: 'lg', backdrop: 'static' });

    this.organization = '';
    this.name = '';
    this.phoneNumber = '';
    this.emailAddress = '';
    this.notes = '';
  }

  submitCaseworker() {
    if (this.organization && this.name && this.phoneNumber && this.emailAddress) {
      const caseworker = new Caseworker();
      caseworker.organization = this.organization;
      caseworker.name = this.name;
      caseworker.phoneNumber = this.phoneNumber;
      caseworker.emailAddress = this.emailAddress;
      caseworker.notes = this.notes;

      this.caseworkerAdded.emit(caseworker);
    }
  }
}