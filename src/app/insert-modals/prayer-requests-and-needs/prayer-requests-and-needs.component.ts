import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { PrayerRequestAndNeed } from 'app/models/prayer-request';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-prayer-requests-and-needs',
  templateUrl: './prayer-requests-and-needs.component.html',
  styleUrls: ['./prayer-requests-and-needs.component.css']
})
export class PrayerRequestsAndNeedsComponent implements OnInit {

  @ViewChild('prayerRequestNeedMdl') prayerRequestNeedMdl: ElementRef;
  @Output() prayerRequestNeedAdded = new EventEmitter<PrayerRequestAndNeed>();
  detail: string = '';

  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.prayerRequestNeedMdl, {size:'lg', backdrop: 'static'});
  }

  submitPrayerRequestNeed() {
    const prayerRequestNeed = new PrayerRequestAndNeed();
    const clientId = localStorage.getItem('selectedClient');
    if (this.detail != null && !isNaN(Number(clientId))) {
      prayerRequestNeed.detail = this.detail;
      prayerRequestNeed.client_id = Number(clientId);
      this.service.insertClientPrayerRequest(prayerRequestNeed).subscribe((data: PrayerRequestAndNeed) => {
        if (data != null && data.id != null) {
          this.prayerRequestNeedAdded.emit(data);
        }
      });
    }
  }

}
