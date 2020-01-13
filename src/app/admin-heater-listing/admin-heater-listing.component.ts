import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { Observable } from 'rxjs';
import { ClientService } from 'app/services/client.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-heater-listing',
  templateUrl: './admin-heater-listing.component.html',
  styleUrls: ['./admin-heater-listing.component.css']
})
export class AdminHeaterListingComponent implements OnInit {

  heaterList: Observable<any>[];

  constructor(private mainService: MainService, private clientService: ClientService) { };

  backIcon = faChevronLeft;


  ngOnInit() {
    this.getHeaterListing();
  }

  unassignHeater(heaterId: number) {
    this.clientService.updateHeaterClient(null, heaterId, 1).subscribe(response => {
      this.getHeaterListing();
    });
  }

  getHeaterListing() {
    this.mainService.getHeaterListing().subscribe(data => {
      this.heaterList = data.sort(function(heater1, heater2) {
        if (heater1.serial_number < heater2.serial_number) {
          return -1;
        }
        else if (heater1.serial_number > heater2.serial_number) {
          return 1;
        }
        else {
          return 0;
        }
      }), error => {
        console.log(error);
      }
    });
  }

}
