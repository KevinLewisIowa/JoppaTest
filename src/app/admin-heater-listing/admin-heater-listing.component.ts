import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-heater-listing',
  templateUrl: './admin-heater-listing.component.html',
  styleUrls: ['./admin-heater-listing.component.css']
})
export class AdminHeaterListingComponent implements OnInit {

  heaterList: Observable<any>[];

  constructor(private service: MainService) { }

  ngOnInit() {
    this.service.getHeaterListing().subscribe(data => {
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
