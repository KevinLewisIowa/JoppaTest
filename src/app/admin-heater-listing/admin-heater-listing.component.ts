import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../services/main.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClientService } from 'app/services/client.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-heater-listing',
  templateUrl: './admin-heater-listing.component.html',
  styleUrls: ['./admin-heater-listing.component.css']
})
export class AdminHeaterListingComponent implements OnInit, OnDestroy {

  heaterList: Observable<any>[];
  tankList: Observable<any>[];
  hoseList: Observable<any>[];
  private destroy$ = new Subject<void>();

  constructor(private mainService: MainService, private clientService: ClientService) { };

  backIcon = faChevronLeft;


  ngOnInit() {
    this.getHeaterTankHoseListing();
  }

  unassignHeater(heaterId: number) {
    this.clientService.updateHeaterClient(null, heaterId, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getHeaterTankHoseListing();
      });
  }

  unassignTank(tankId: number) {
    this.clientService.updateTankInteraction(tankId, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getHeaterTankHoseListing();
      });
  }

  unassignHose(hoseId: number) {
    this.clientService.updateHoseInteraction(hoseId, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getHeaterTankHoseListing();
      });
  }

  getHeaterTankHoseListing() {
    this.mainService.getHeaterListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
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
        });
      }, error => {
        console.log(error);
      });

    this.mainService.getHoseListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.hoseList = data;
      }, error => console.log(error));

    this.mainService.getTankListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.tankList = data;
      }, error => console.log(error));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
