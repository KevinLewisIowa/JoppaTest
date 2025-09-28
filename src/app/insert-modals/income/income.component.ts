import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientIncome } from 'app/models/client-income';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
  @ViewChild('incomeMdl', {static: false}) incomeMdl: ElementRef
  @Output() incomeAdded = new EventEmitter<ClientIncome>();

  has_income: boolean = false;
  monthly_money: string = '';
  what_income_from: string = '';
  other_income_from: string = '';

  constructor(private modalService: NgbModal, private service: ClientService) {

  }

  ngOnInit() {

  }

  showModal() {
    this.modalService.open(this.incomeMdl, { size: 'lg', backdrop: 'static'});
  this.has_income = false;
  this.monthly_money = '';
  this.what_income_from = '';
  this.other_income_from = '';
  }

  submitIncome() {
    const income = new ClientIncome();
    const clientId = localStorage.getItem('selectedClient');
    if (this.monthly_money != null && !isNaN(Number(clientId))) {
      income.client_id = Number(clientId);
      income.has_income = this.has_income;
      income.monthly_money = this.monthly_money;
      if (this.what_income_from === 'Other') {
        income.what_income_from = this.other_income_from;
      } else {
        income.what_income_from = this.what_income_from;
      }
      this.service.insertClientIncome(income).subscribe(income_created => {
        if (income_created != null && income_created.id != null) {
          this.incomeAdded.emit(income_created);
        }
      }, error => console.log(error));
    }
  }
}
