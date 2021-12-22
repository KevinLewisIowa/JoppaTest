import { DatePipe } from '@angular/common';
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
  datepipe: DatePipe;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.date_seen = new Date();
  }

  submitDate() {
    let now: Date = new Date;
    this.date_seen = new Date(this.date_seen);
    this.date_seen = new Date(this.date_seen.getUTCFullYear(), this.date_seen.getUTCMonth(), this.date_seen.getUTCDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    this.activeModal.close(this.date_seen);
  }

}
