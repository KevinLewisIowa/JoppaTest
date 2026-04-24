import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-admin-check-in',
  templateUrl: './admin-check-in.component.html',
  styleUrls: ['./admin-check-in.component.css']
})
export class AdminCheckInComponent implements OnInit, OnDestroy {
  backIcon = faChevronLeft;

  
  heatersUpdated: number;
  private destroy$ = new Subject<void>();

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
  }

  checkInHeaters() {
    this.mainService.checkInAllHeaters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((recordsUpdated: number) => {
        this.heatersUpdated = recordsUpdated;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
