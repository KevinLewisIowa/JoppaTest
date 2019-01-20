import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-seen-serviced-report',
  templateUrl: './admin-seen-serviced-report.component.html',
  styleUrls: ['./admin-seen-serviced-report.component.css']
})
export class AdminSeenServicedReportComponent implements OnInit {
  seenServicedRecords : any[];
  fromDate : Date = new Date();
  toDate : Date = new Date();

  constructor(private mainService : MainService) { }

  ngOnInit() {
    
  }

  searchSeenAndServiced() {
    this.mainService.getSeenServicedReport(this.fromDate, this.toDate).subscribe(data => {
      this.seenServicedRecords = data;
    }, error => console.log(error));
  }

}
