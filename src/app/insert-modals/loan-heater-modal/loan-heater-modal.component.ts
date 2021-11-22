import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Heater } from 'app/models/heater';
import { ClientService } from 'app/services/client.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-loan-heater-modal',
  templateUrl: './loan-heater-modal.component.html',
  styleUrls: ['./loan-heater-modal.component.css']
})
export class LoanHeaterModalComponent implements OnInit {
  availableHeaters = [];
  routeInstanceId: number;
  isAdmin: boolean = false;
  @ViewChild('heaterMdl', {static: false}) heaterMdl: ElementRef;
  @Output() loaningHeater = new EventEmitter<number>();
  constructor(private service: ClientService, private mainService: MainService, private modalService: NgbModal) { }

  ngOnInit() {
    this.routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  showModal() {
    if (this.isAdmin) {
      this.routeInstanceId = 0;
      this.mainService.getAvailableHeaters(this.routeInstanceId).subscribe((heaters : any[]) => {
        this.availableHeaters = heaters;
      })
    }
    else {
      this.service.getCheckedOutHeaters(this.routeInstanceId).subscribe((heaters: any[]) => {
        this.availableHeaters = heaters;
      });
    }

    this.modalService.open(this.heaterMdl, { size: 'lg', backdrop: 'static'});
  }

  selectedHeater(theHeater) {
    if (!this.isAdmin) {
      let checkedOutHeaterList: any[] = JSON.parse(window.localStorage.getItem('checkedOutHeaters'));
      let selectedHeater = checkedOutHeaterList.find(heater => heater.heater_id === theHeater.heater_id);
      var indexToRemove: number = checkedOutHeaterList.indexOf(selectedHeater);
      checkedOutHeaterList.splice(indexToRemove, 1);
      window.localStorage.setItem('checkedOutHeaters', JSON.stringify(checkedOutHeaterList));

      let routeInstanceHeaterInteraction: RouteInstanceHeaterInteraction = new RouteInstanceHeaterInteraction();
      routeInstanceHeaterInteraction.id = theHeater.id; routeInstanceHeaterInteraction.is_checked_out = false;
      this.mainService.updateRouteInstanceHeaterInteraction(routeInstanceHeaterInteraction);

      this.loaningHeater.emit(theHeater.heater_id);
    }
    else {
      this.loaningHeater.emit(theHeater.id);
    }
  }

}
