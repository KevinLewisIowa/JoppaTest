import { Component, ViewChild, Output, OnInit, ElementRef, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';
import { ClientDwelling } from 'app/models/client-dwelling';

@Component({
  selector: 'app-client-dwellings',
  templateUrl: './client-dwelling.component.html',
  styleUrls: ['./client-dwelling.component.css']
})
export class ClientDwellingComponent implements OnInit, AfterViewChecked {
  @ViewChild('clientDwellingMdl', { static: false }) clientDwellingMdl: ElementRef;
  @Output() clientDwellingAdded = new EventEmitter<ClientDwelling>();
  isAdmin: boolean = false;
  initialOther: boolean = false;
  date_moved: Date;
  dwelling: string = '';
  other_dwelling: string = '';
  where_sleep_last_night: string = '';
  notes: string = '';
  extraInfoNeeded: boolean = false;
  client_id: number;

  constructor(private modalService: NgbModal, private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement && this.other_dwelling == '' && this.initialOther) {
        this.initialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.clientDwellingMdl, { size: 'lg', backdrop: 'static' });

    this.dwelling = '';
    this.notes = '';
    this.where_sleep_last_night = '';
    this.other_dwelling = '';
    this.date_moved = null;
  }

  onChange() {
    if (this.dwelling == 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.other_dwelling = '';
    }
  }

  submitClientDwelling() {
    const clientDwelling = new ClientDwelling();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));

    if (this.dwelling === '') {
      alert('No dwelling entered');
      return;
    }

    if (this.dwelling !== '' && this.where_sleep_last_night !== '' && !isNaN(clientId) && !isNaN(routeInstanceId)) {
      if (this.date_moved == null) {
        clientDwelling.date_moved = new Date();
      } else {
        clientDwelling.date_moved = new Date(this.date_moved);
      }
      clientDwelling.dwelling = (this.dwelling == 'Other') ? this.other_dwelling : this.dwelling;
      clientDwelling.notes = this.notes;
      clientDwelling.client_id = clientId;
      clientDwelling.where_sleep_last_night = this.where_sleep_last_night;

      this.clientService.insertClientDwelling(clientDwelling).subscribe((data: ClientDwelling) => {
        if (data != null && data.id != null) {
          this.clientDwellingAdded.emit(data);
        }
      }, error => { console.log(error) });
    }
  }

}
