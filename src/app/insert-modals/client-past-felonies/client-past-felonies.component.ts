import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ClientFelony } from '../../models/client-felony';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../services/client.service';
import { ChangeDetectorRef, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-client-past-felonies',
  templateUrl: './client-past-felonies.component.html',
  styleUrls: ['./client-past-felonies.component.css']
})
export class ClientPastFeloniesComponent implements OnInit, AfterViewChecked {
  @ViewChild('clientFelonyMdl', { static: false }) clientFelonyMdl: ElementRef;
  @Output() clientFelonyAdded = new EventEmitter<ClientFelony>();
  isAdmin: boolean = false;
  felony_type: string = '';
  other_felony_type: string = '';
  year_occurred: string = '';
  felonyTypes = [
    'Violent Felony',
    'Drug Felony',
    'Theft Felony',
    'Sex Felony',
    'Other'
  ];
  extraInfoNeeded: boolean = false;
  initialOther: boolean = false;
  notes: string = '';
  client_id: number;

  constructor(private modalService: NgbModal, private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement && this.other_felony_type == '' && this.initialOther) {
        this.initialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.clientFelonyMdl, { size: 'lg', backdrop: 'static' });

    this.felony_type = '';
    this.year_occurred = '';
    this.notes = '';
  }

  onChange() {
    if (this.felony_type == 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.felony_type = '';
    }
  }

  submitClientFelony() {
    const clientFelony = new ClientFelony();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));

    if (this.felony_type === '' || this.year_occurred === '') {
      alert('Felony type or year occurred not entered');
      return;
    }

    if (!isNaN(clientId)) {
      clientFelony.felony_type = this.felony_type === 'Other' ? this.other_felony_type : this.felony_type;
      clientFelony.year_occurred = this.year_occurred;
      clientFelony.notes = this.notes;
      clientFelony.client_id = clientId;

      this.clientService.insertFelony(clientFelony).subscribe((data: ClientFelony) => {
        if (data != null && data.id != null) {
          this.clientFelonyAdded.emit(data);
        }
      }, error => { console.log(error) });
    }
  }
}