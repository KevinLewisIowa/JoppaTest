import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  createNewHeater() {
    this.router.navigate([`heaterNew`]);
  }

  openAdminReports() {
    this.router.navigate(['/admin/reports']);
  }

  goToRoutes() {
    this.router.navigate(['routes']);
  }

  goToHeatRoutes() {
    window.localStorage.setItem('heatRoute', JSON.stringify(true));
    this.router.navigate(['routes']);
  }

  openChangeRegularPassword() {
    this.router.navigate(['changeRegularPassword']);
  }

}
