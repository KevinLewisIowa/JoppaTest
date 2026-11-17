import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from 'app/models/client';
import { ClientService } from '../../services/client.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-birthday-months-report',
  templateUrl: './birthday-months-report.component.html',
  styleUrls: ['./birthday-months-report.component.css']
})
export class BirthdayMonthsReportComponent implements OnInit, OnDestroy {
  monthBirthdays: Client[] = [];
  monthInt = 1;
  resultMessage = '';
  private destroy$ = new Subject<void>();
  constructor(private service: ClientService) { };
  backIcon = faChevronLeft;


  ngOnInit() {
    this.monthChanged(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  monthChanged(val) {
    this.service.getBirthdaysByMonth(this.monthInt)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Client[]) => {
      this.monthBirthdays = data;
      this.resultMessage = 'There are ' + data.length + ' total birthdays in the selected month.';
    }, error => {
      this.monthBirthdays = [];
      this.resultMessage = 'Error getting results';
    });
  }

}
