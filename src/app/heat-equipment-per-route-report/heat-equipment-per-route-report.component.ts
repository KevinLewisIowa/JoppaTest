import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '../../../node_modules/@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-heat-equipment-per-route-report',
  templateUrl: './heat-equipment-per-route-report.component.html',
  styleUrls: ['./heat-equipment-per-route-report.component.css']
})
export class HeatEquipmentPerRouteReportComponent implements OnInit, OnDestroy {
  heatEquipmentData: any[] = [];
  backIcon = faChevronLeft;
  private destroy$ = new Subject<void>();

  constructor(private mainService: MainService, private router: Router) { };


  ngOnInit() {
    this.mainService.getHeatEquipmentPerRoute()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.heatEquipmentData = data;
      });
  }

  back() {
    this.router.navigate([`/admin/reports`]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
