import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientHomelessHistory } from 'app/models/client-homeless-histories';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-homeless-history',
  templateUrl: './client-homeless-history.component.html',
  styleUrls: ['./client-homeless-history.component.css']
})
export class ClientHomelessHistoryComponent {
  @ViewChild('clientHomelessHistoryMdl', {static: false}) clientHomelessHistoryMdl: ElementRef;
  @Output() clientHistoryAdded = new EventEmitter<ClientHomelessHistory>();
  isAdmin: boolean = false;
  first_time_homeless: boolean = false;
  date_became_homeless: Date;
  homeless_reason: string = '';
  other_homeless_reason: string = '';
  notes: string = '';
  extraInfoNeededForHomelessReason: boolean = false;
  client_id: number;

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  showModal() {
    this.modalService.open(this.clientHomelessHistoryMdl, {size: 'lg', backdrop: 'static'});

    this.first_time_homeless = false;
    this.homeless_reason = '';
    this.notes = '';
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
    }
  }

  submitClientHomelessHistory() {
    const clientHistory = new ClientHomelessHistory();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));
    
    if (!isNaN(clientId) && !isNaN(routeInstanceId)) {
      if (typeof this.date_became_homeless === 'undefined') {
        alert('Date became homeless not fully entered');
        return;
      }
      clientHistory.first_time_homeless = this.first_time_homeless;
      clientHistory.date_became_homeless = new Date(this.date_became_homeless);
      clientHistory.reason_for_homelessness = (this.homeless_reason == 'Other') ? this.other_homeless_reason : this.homeless_reason;
      clientHistory.note = this.notes;
      clientHistory.client_id = clientId;
      
      console.log(JSON.stringify(clientHistory));
      this.clientService.insertClientHomelessHistory(clientHistory).subscribe((data: ClientHomelessHistory) => {
        if (data != null && data.id != null) {
          console.log(JSON.stringify(data));
          this.clientHistoryAdded.emit(data);
        }
      }, error => {console.log(error)});
    }
  }
}
