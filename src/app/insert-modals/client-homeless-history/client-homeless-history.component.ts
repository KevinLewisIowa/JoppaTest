import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientHomelessHistory } from 'app/models/client-homeless-histories';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-homeless-history',
  templateUrl: './client-homeless-history.component.html',
  styleUrls: ['./client-homeless-history.component.css']
})
export class ClientHomelessHistoryComponent implements AfterViewChecked {
  @ViewChild('clientHomelessHistoryMdl', { static: false }) clientHomelessHistoryMdl: ElementRef;
  @Output() clientHistoryAdded = new EventEmitter<ClientHomelessHistory>();
  isAdmin: boolean = false;
  first_time_homeless: boolean = false;
  date_became_homeless: Date;
  homeless_reason: string = '';
  other_homeless_reason: string = '';
  initialOther: boolean = true;
  notes: string = '';
  extraInfoNeeded: boolean = false;
  client_id: number;
  reason_for_homelessness: string[] = [
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

  constructor(private modalService: NgbModal, private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      setTimeout(() => {
        const extraInfoElement = document.getElementById('extraInfo');
        if (extraInfoElement && this.other_homeless_reason == '' && this.initialOther) {
          this.initialOther = false;
          extraInfoElement.focus();
        }
      }, 0);
    }
  }

  showModal() {
    this.modalService.open(this.clientHomelessHistoryMdl, { size: 'lg', backdrop: 'static' });

    this.first_time_homeless = false;
    this.homeless_reason = '';
    this.notes = '';
    this.date_became_homeless = null;
  }

  onChange() {
    if (this.homeless_reason == 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.other_homeless_reason = '';
    }
  }

  submitClientHomelessHistory() {
    const clientHistory = new ClientHomelessHistory();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));

    if (!isNaN(clientId) && !isNaN(routeInstanceId)) {
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
      }, error => { console.log(error) });
    }
  }
}
