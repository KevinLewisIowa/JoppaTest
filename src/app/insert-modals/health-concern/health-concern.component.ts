import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HealthConcern } from "app/models/health-concern";
import { ClientService } from "app/services/client.service";

@Component({
  selector: 'app-health-concern',
  templateUrl: './health-concern.component.html',
  styleUrls: ['./health-concern.component.css']
})
export class HealthConcernComponent implements OnInit {
@ViewChild('healthConcernMdl') healthConcernMdl: ElementRef;
@Output() healthConcernAdded = new EventEmitter<HealthConcern>();
description: string = '';
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.healthConcernMdl, { size: 'lg', backdrop: 'static'});
  }

  submitHealthConcern() {
    const concern = new HealthConcern();
    const clientId = localStorage.getItem('selectedClient');
    if (this.description != null && !isNaN(Number(clientId))) {
      concern.description = this.description;
      concern.client_id = Number(clientId);
      this.service.insertHealthConcern(concern).subscribe((data: HealthConcern) => {
        if (data != null && data.id != null) {
          this.healthConcernAdded.emit(data);
        }
      }, error => { console.log('error saving health concern')});
    }
  }

}
