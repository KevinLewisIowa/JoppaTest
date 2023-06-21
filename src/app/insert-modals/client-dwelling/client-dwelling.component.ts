import { Component, ViewChild, Output, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';
import { ClientDwelling } from 'app/models/client-dwelling';

@Component({
  selector: 'app-client-dwellings',
  templateUrl: './client-dwelling.component.html',
  styleUrls: ['./client-dwelling.component.css']
})
export class ClientDwellingComponent implements OnInit {
  @ViewChild('clientDwellingMdl', {static: false}) clientDwellingMdl: ElementRef;
  @Output() clientDwellingAdded = new EventEmitter<ClientDwelling>();
  isAdmin: boolean = false;
  first_time_homeless: boolean = false;
  date_became_homeless: Date;
  dwelling: string = '';
  other_dwelling: string = '';
  homeless_reason: string = '';
  other_homeless_reason: string = '';
  notes: string = '';
  extraInfoNeededForDwelling: boolean = false;
  extraInfoNeededForHomelessReason: boolean = false;
  client_id: number;

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  showModal() {
    this.modalService.open(this.clientDwellingMdl, {size: 'lg', backdrop: 'static'});
  }

  onChange(field_name: string, value: string) {
    switch (field_name) {
      case 'homeless_reason':
        if (value == 'Other') {
          this.extraInfoNeededForHomelessReason = true;
        } else {
          this.extraInfoNeededForHomelessReason = false;
          this.other_homeless_reason = '';
        }
        break;
      case 'dwelling':
        if (value == 'Other') {
          this.extraInfoNeededForDwelling = true;
        } else {
          this.extraInfoNeededForDwelling = false;
          this.other_dwelling = '';
        }
    }
  }

  submitClientDwelling() {
    const clientDwelling = new ClientDwelling();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));
    
    if (this.dwelling != null && !isNaN(clientId) && !isNaN(routeInstanceId)) {
      clientDwelling.first_time_homeless = this.first_time_homeless;
      clientDwelling.date_became_homeless = new Date(this.date_became_homeless);
      clientDwelling.dwelling = (this.dwelling == 'Other') ? this.other_dwelling : this.dwelling;
      clientDwelling.homeless_reason = (this.homeless_reason == 'Other') ? this.other_homeless_reason : this.homeless_reason;
      clientDwelling.notes = this.notes;
      clientDwelling.client_id = clientId;
      
      console.log(JSON.stringify(clientDwelling));
      this.clientService.insertClientDwelling(clientDwelling).subscribe((data: ClientDwelling) => {
        if (data != null && data.id != null) {
          this.clientDwellingAdded.emit(data);
        }
      }, error => {console.log(error)});
    }

    this.dwelling = '';
    this.first_time_homeless = false;
    this.homeless_reason = '';
    this.notes = '';
  }

}
