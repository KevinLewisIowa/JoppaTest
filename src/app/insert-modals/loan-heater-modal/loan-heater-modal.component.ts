import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Heater } from 'app/models/heater';
import { ClientService } from 'app/services/client.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loan-heater-modal',
  templateUrl: './loan-heater-modal.component.html',
  styleUrls: ['./loan-heater-modal.component.css']
})
export class LoanHeaterModalComponent implements OnInit {
  availableHeaters = [];
  @ViewChild('heaterMdl') heaterMdl: ElementRef;
  @Output() loaningHeater = new EventEmitter<number>();
  constructor(private service: ClientService, private modalService: NgbModal) { }

  ngOnInit() {

  }

  showModal() {
    console.log('opening modal');
    this.service.getAvailableHeaters().subscribe((data: any[]) => {
      console.log(data);
      this.availableHeaters = data;
    });
    this.modalService.open(this.heaterMdl, { size: 'lg', backdrop: 'static'});
  }

  selectedHeater(theId) {
    this.loaningHeater.emit(theId);
  }

}
