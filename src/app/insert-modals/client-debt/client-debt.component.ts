import { Component } from '@angular/core';
import { OnInit, AfterViewChecked, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../services/client.service';
import { ClientDebt } from '../../models/client-debt';

@Component({
  selector: 'app-client-debt',
  templateUrl: './client-debt.component.html',
  styleUrls: ['./client-debt.component.css']
})
export class ClientDebtComponent implements OnInit, AfterViewChecked {
  @ViewChild('clientDebtMdl', { static: false }) clientDebtMdl: ElementRef;
  @Output() debtAdded = new EventEmitter<ClientDebt>();
  isAdmin: boolean = false;
  debt_type: string = '';
  other_debt_type: string = '';
  extraInfoNeeded: boolean = false;
  initialOther: boolean = false;
  amount: string = '';
  notes: string = '';
  client_id: number;
  debtTypes = [
    'Medical Bill',
    'Utility Bill',
    'Overdue Rent',
    'Credit Card Debt',
    'Court Debt',
    'Student Loans',
    'Other'
  ];

  constructor(private modalService: NgbModal, private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement && this.other_debt_type == '' && this.initialOther) {
        this.initialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.clientDebtMdl, { size: 'lg', backdrop: 'static' });

    this.debt_type = '';
    this.amount = '';
    this.notes = '';
  }

  onChange() {
    if (this.debt_type == 'Other') {
      this.extraInfoNeeded = true;
      this.initialOther = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.other_debt_type = '';
    }
  }

  submitDebt() {
    const clientDebt = new ClientDebt();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));

    if (this.debt_type === '' || this.amount === '') {
      alert('Debt type or amount not entered');
      return;
    }

    if (!isNaN(clientId)) {
      clientDebt.debt_type = this.debt_type === 'Other' ? this.other_debt_type : this.debt_type;
      clientDebt.amount = this.amount;
      clientDebt.notes = this.notes;
      clientDebt.client_id = clientId;

      this.clientService.insertDebt(clientDebt).subscribe((data: ClientDebt) => {
        if (data != null && data.id != null) {
          this.debtAdded.emit(data);
        }
      }, error => { console.log(error) });
    }
  }
}