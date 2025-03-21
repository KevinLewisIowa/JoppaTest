import { Component } from '@angular/core';
import { ElementRef, EventEmitter, Output, ViewChild, ChangeDetectorRef, OnInit, AfterViewChecked } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientPastEviction } from '../../models/client-past-eviction';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-past-evictions',
  templateUrl: './client-past-evictions.component.html',
  styleUrls: ['./client-past-evictions.component.css']
})
export class ClientPastEvictionsComponent implements OnInit, AfterViewChecked {
  @ViewChild('clientEvictionMdl', { static: false }) clientEvictionMdl: ElementRef;
  @Output() clientEvictionAdded = new EventEmitter<ClientPastEviction>();
  isAdmin: boolean = false;
  eviction_type: string = '';
  other_eviction_type: string = '';
  year_occurred: string = '';
  evictionTypes = [
    'Non-Payment',
    'Domestic Violence',
    'Too Much Foot Traffic',
    'Property Damage',
    'Non-Renewal of Lease',
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
      if (extraInfoElement && this.other_eviction_type == '' && this.initialOther) {
        this.initialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.clientEvictionMdl, { size: 'lg', backdrop: 'static' });

    this.eviction_type = '';
    this.year_occurred = '';
    this.notes = '';
  }

  onChange() {
    if (this.eviction_type == 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.eviction_type = '';
    }
  }

  submitClientEviction() {
    const clientEviction = new ClientPastEviction();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));

    if (this.eviction_type === '' || this.year_occurred === '') {
      alert('Eviction type or year occurred not entered');
      return;
    }

    if (!isNaN(clientId)) {
      clientEviction.eviction_type = this.eviction_type === 'Other' ? this.other_eviction_type : this.eviction_type;
      clientEviction.year_occurred = this.year_occurred;
      clientEviction.notes = this.notes;
      clientEviction.client_id = clientId;

      this.clientService.insertPastEviction(clientEviction).subscribe((data: ClientPastEviction) => {
        if (data != null && data.id != null) {
          this.clientEvictionAdded.emit(data);
        }
      }, error => { console.log(error) });
    }
  }
}