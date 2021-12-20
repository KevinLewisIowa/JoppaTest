import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit {
  @ViewChild("dateSelectorMdl", {static: false}) dateSelectorMdl: ElementRef;
  @Output() dateSelected = new EventEmitter<Date>();
  date_seen: Date;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.date_seen = new Date();
  }

  // showModal() {
  //   this.modalService.open(this.dateSelectorMdl, {
  //     size: "lg",
  //     backdrop: "static"
  //   });
  // }

  submitDate() {
    this.activeModal.close(this.date_seen);
  }

  // close(): void {
  //   const closeMessage = 'Modal closed';
  //   this.modalService.close(closeMessage);
  // }

}
