import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientVitalRecord } from 'app/models/client-vital-record';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-vital-record',
  templateUrl: './vital-record.component.html'
})
export class VitalRecordComponent {
  @ViewChild('vitalRecordModal', { static: false }) vitalRecordModal!: ElementRef;
  @Output() recordSaved = new EventEmitter<ClientVitalRecord>();

  readonly documentTypes = [
    'Birth certificate',
    'Copy of birth certificate',
    "Copy of driver's license",
    'Copy of ID',
    'Copy of social security card',
    'Drivers license',
    'ID',
    'Medical record',
    'Legal document',
    'Social security card',
    'Photo(s)',
    'Other'
  ];

  record: ClientVitalRecord = new ClientVitalRecord();
  editing = false;

  constructor(private modalService: NgbModal, private service: ClientService) { }

  showModal(record?: ClientVitalRecord) {
    this.editing = !!record;
    this.record = record ? { ...record } as ClientVitalRecord : new ClientVitalRecord();
    if (!record) {
      this.record.entered_on = this.localDateString();
    }
    this.modalService.open(this.vitalRecordModal, { size: 'lg', backdrop: 'static' });
  }

  submit() {
    this.record.client_id = Number(localStorage.getItem('selectedClient'));
    if (this.editing) {
      this.service.updateClientVitalRecord(this.record).subscribe(
        saved => this.completeSave(saved),
        error => console.log(error)
      );
    } else {
      this.service.insertClientVitalRecord(this.record).subscribe(
        saved => this.completeSave(saved),
        error => console.log(error)
      );
    }
  }

  private completeSave(response: Object) {
    const saved = response as ClientVitalRecord;
    if (saved && saved.id) {
      this.recordSaved.emit(saved);
      this.modalService.dismissAll();
    }
  }

  private localDateString(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}