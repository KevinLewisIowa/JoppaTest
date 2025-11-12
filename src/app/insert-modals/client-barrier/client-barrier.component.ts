import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientBarrier } from 'app/models/client-barrier';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-barrier',
  templateUrl: './client-barrier.component.html',
  styleUrls: ['./client-barrier.component.css']
})
export class ClientBarrierComponent {
  @ViewChild('clientBarrierMdl', { static: false }) clientBarrierMdl: ElementRef;
  @Output() barrierAdded = new EventEmitter<ClientBarrier>();

  barrierType: string = '';
  otherBarrier: string = '';
  notes: string = '';
  extraInfoNeeded: boolean = false;
  initialOther: boolean = true;

  barrierTypes: string[] = [
    'Alcoholic',
    'Drug User',
    'Lack of Childcare',
    'Lack of Community',
    'Legal Issue',
    'Lost Greencard',
    'Major Health Issue',
    'Major Mental Health Issue',
    'Memory Problems',
    'Not Legal Residence',
    'Other'
  ];

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {}

  showModal() {
    this.modalService.open(this.clientBarrierMdl, { size: 'lg', backdrop: 'static' });
    this.barrierType = '';
    this.otherBarrier = '';
    this.notes = '';
    this.extraInfoNeeded = false;
    this.initialOther = true;
  }

  onBarrierTypeChange() {
    if (this.barrierType === 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    } else {
      this.extraInfoNeeded = false;
      this.otherBarrier = '';
    }
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      const extraInfoElement = document.getElementById('extraInfoOrg');
      if (extraInfoElement && this.otherBarrier == '' && this.initialOther) {
        this.initialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  submitBarrier(close?: Function) {
    const barrier = new ClientBarrier();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));

    barrier.barrier_type = (this.barrierType === 'Other') ? this.otherBarrier : this.barrierType;
    barrier.note = this.notes;
    barrier.client_id = clientId;
    
    if (barrier.barrier_type) {
      this.clientService.insertBarrier(barrier).subscribe((data: ClientBarrier) => {
        if (data && data.id) {
          this.barrierAdded.emit(data);
          if (close) close();
        }
      }, error => { console.log(error); });
    }
    else {
      alert('Please fill in all required fields: Barrier Type.');
    }
  }
}
