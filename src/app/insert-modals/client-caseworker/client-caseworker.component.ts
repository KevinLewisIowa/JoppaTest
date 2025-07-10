import { Component, ViewChild, Output, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Caseworker } from '../../models/caseworker';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-caseworker',
  templateUrl: './client-caseworker.component.html',
  styleUrls: ['./client-caseworker.component.css']
})
export class ClientCaseworkerComponent implements OnInit {
  @ViewChild('clientCaseworkerMdl', { static: false }) clientCaseworkerMdl: ElementRef;
  @Output() caseworkerAdded = new EventEmitter<Caseworker>();

  organization: string = '';
  otherOrganization: string = '';
  name: string = '';
  phoneNumber: string = '';
  emailAddress: string = '';
  notes: string = '';
  extraInfoNeeded: boolean = false;
  initialOther: boolean = true;

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

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {}

  showModal() {
    this.modalService.open(this.clientCaseworkerMdl, { size: 'lg', backdrop: 'static' });
    this.organization = '';
    this.otherOrganization = '';
    this.name = '';
    this.phoneNumber = '';
    this.emailAddress = '';
    this.notes = '';
    this.extraInfoNeeded = false;
    this.initialOther = true;
  }

  onOrganizationChange() {
    if (this.organization === 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    } else {
      this.extraInfoNeeded = false;
      this.otherOrganization = '';
    }
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      const extraInfoElement = document.getElementById('extraInfoOrg');
      if (extraInfoElement && this.otherOrganization == '' && this.initialOther) {
        this.initialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  submitCaseworker() {
    const caseworker = new Caseworker();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));

    caseworker.organization = (this.organization === 'Other') ? this.otherOrganization : this.organization;
    caseworker.name = this.name;
    caseworker.phone = this.phoneNumber;
    caseworker.email = this.emailAddress;
    caseworker.notes = this.notes;
    caseworker.client_id = clientId;

    if (caseworker.organization && caseworker.name && (caseworker.phone || caseworker.email)) {
      this.clientService.insertCaseworker(caseworker).subscribe((data: Caseworker) => {
        if (data && data.id) {
          this.caseworkerAdded.emit(data);
        }
      }, error => { console.log(error); });
    }
  }
}