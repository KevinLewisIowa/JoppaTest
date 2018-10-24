import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openNewClientsReport() {
    this.router.navigate(['/admin/reports/newClients']);
  }

}
