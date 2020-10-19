import { Component, OnInit } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-first-time-homelessness-report',
  templateUrl: './first-time-homelessness-report.component.html',
  styleUrls: ['./first-time-homelessness-report.component.css']
})
export class FirstTimeHomelessnessReportComponent implements OnInit {
  clients: any[] = [];
  backIcon = faChevronLeft;

  constructor(private service: MainService) { };

  ngOnInit() {
    this.service.getFirstTimeHomelessnessReport().subscribe(data => {
      this.clients = data;
    }, error => {console.log(error)});
  }

}
