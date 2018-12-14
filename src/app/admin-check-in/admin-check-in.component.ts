import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-check-in',
  templateUrl: './admin-check-in.component.html',
  styleUrls: ['./admin-check-in.component.css']
})
export class AdminCheckInComponent implements OnInit {
  heatersUpdated: number;

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
  }

  checkInHeaters() {
    this.mainService.checkInAllHeaters().subscribe((recordsUpdated: number) => {
      this.heatersUpdated = recordsUpdated;
    });
  }

}
