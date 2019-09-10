import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from 'app/models/client';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-birthday-months-report',
  templateUrl: './birthday-months-report.component.html',
  styleUrls: ['./birthday-months-report.component.css']
})
export class BirthdayMonthsReportComponent implements OnInit, OnDestroy {
  monthBirthdays: Client[] = [];
  monthInt = 1;
  subscriptions: any[] = [];
  resultMessage = '';
  constructor(private service: ClientService) { }

  ngOnInit() {
    this.monthChanged(null);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  monthChanged(val) {
    this.subscriptions.push(this.service.getBirthdaysByMonth(this.monthInt).subscribe((data: Client[]) => {
      this.monthBirthdays = data;
      this.resultMessage = 'There are ' + data.length + ' total birthdays in the selected month.';
    }, error => {
      this.monthBirthdays = [];
      this.resultMessage = 'Error getting results';
    }));
  }

}
