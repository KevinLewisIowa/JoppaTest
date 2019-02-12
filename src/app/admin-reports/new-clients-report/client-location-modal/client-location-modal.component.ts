import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from 'app/models/route';
import { LocationCamp } from 'app/models/location-camp';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-client-location-modal',
  templateUrl: './client-location-modal.component.html',
  styleUrls: ['./client-location-modal.component.css']
})
export class ClientLocationModalComponent implements OnInit {
  @ViewChild('locationModal') locationModal: ElementRef;
  modalTitle = '';
  route = new Route();
  locationCamp = new LocationCamp();
  constructor(private modalService: NgbModal, private mainService: MainService) { }

  ngOnInit() {
  }

  showModal(theTitle, campId) {
    this.modalTitle = theTitle;
    this.mainService.getLocationCamp(campId).subscribe(data => {
      this.locationCamp = data;
      this.mainService.getRoute(this.locationCamp.route_id).subscribe(data2 => {
        this.route = data2;
      });
    });
    this.modalService.open(this.locationModal, { size: 'lg', backdrop: 'static'});
  }

}
