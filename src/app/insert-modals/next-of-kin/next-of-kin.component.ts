import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientNextOfKin } from 'app/models/client-next-of-kin';
import { ClientService } from 'app/services/client.service';
import { formatPhoneNumberValue } from 'app/utils/phone-utils';

@Component({
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.component.html',
  styleUrls: ['./next-of-kin.component.css']
})
export class NextOfKinComponent implements OnInit {
  @ViewChild('nextOfKinMdl', { static: false }) nextOfKinMdl: ElementRef
  @Output() nextOfKinAdded = new EventEmitter<ClientNextOfKin>();

  name: string = '';
  phone_number: string = '';
  relation_to_client: string = '';
  street_address: string = '';
  email: string = '';
  note: string = '';

  constructor(private modalService: NgbModal, private service: ClientService) {

  }

  ngOnInit() {

  }

  showModal() {
    this.modalService.open(this.nextOfKinMdl, { size: 'lg', backdrop: 'static' });
    this.name = '';
    this.phone_number = '';
    this.relation_to_client = '';
    this.street_address = '';
    this.email = '';
    this.note = '';
  }

  submitNextOfKin() {
    const nextOfKin = new ClientNextOfKin();
    const clientId = localStorage.getItem('selectedClient');
    if (this.name != null && !isNaN(Number(clientId))) {
      nextOfKin.client_id = Number(clientId);
      nextOfKin.name = this.name;
      nextOfKin.phone_number = this.phone_number
      nextOfKin.relation_to_client = this.relation_to_client;
      nextOfKin.street_address = this.street_address;
      nextOfKin.email = this.email;
      nextOfKin.note = this.note;

      this.service.insertClientNextOfKin(nextOfKin).subscribe(new_next_of_kin => {
        if (new_next_of_kin != null && new_next_of_kin.id != null) {
          this.nextOfKinAdded.emit(new_next_of_kin);
        }
      }, error => console.log(error));
    }
  }

  formatPhoneNumber() {
    this.phone_number = formatPhoneNumberValue(this.phone_number);
  }
}
