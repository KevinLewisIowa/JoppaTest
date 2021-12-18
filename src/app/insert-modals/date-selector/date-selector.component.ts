import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit {
  @ViewChild("dateSelectorMdl", {static: false}) dateSelectorMdl: ElementRef;
  @Output() dateSelected = new EventEmitter<Date>();
  seen_date: Date = new Date();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  showModal() {
    this.modalService.open(this.dateSelectorMdl, {
      size: "lg",
      backdrop: "static"
    });
  }

  submitDate() {
    this.dateSelected.emit(this.seen_date);
  }

}
