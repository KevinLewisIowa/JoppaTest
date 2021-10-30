import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { faSearch, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-overall-attendance',
  templateUrl: './admin-overall-attendance.component.html',
  styleUrls: ['./admin-overall-attendance.component.css']
})
export class AdminOverallAttendanceComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  minDate: Date = new Date(2018, 8, 1);
  maxDate = new Date();
  attendanceCounts: any;
  pipe = new DatePipe('en-US');
  searchIcon = faSearch;
  backIcon = faChevronLeft;

  constructor(private mainService: MainService, private router: Router) {
    
  }

  ngOnInit() {
    
  }

  retrieveOverallAttendance() {
    this.mainService.getOverallAttendanceReport(this.pipe.transform(this.startDate, 'short'), this.pipe.transform(this.endDate, 'short')).subscribe(data => {
      this.attendanceCounts = data;
    }, error => console.log(error));
  }

  back() {
    this.router.navigate(['/admin/reports']);
  }

}
