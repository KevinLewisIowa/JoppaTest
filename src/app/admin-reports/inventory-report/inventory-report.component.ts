import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css']
})
export class InventoryReportComponent implements OnInit {
  inventory: Inventory = new Inventory();
  constructor(private mainService: MainService, private router: Router) { };
  backIcon = faChevronLeft;


  ngOnInit() {
    this.mainService.getInventorySummary().subscribe(data => {
      this.inventory = data;
    })
  }

  back() {
    this.router.navigate([`/admin/reports`]);
  }

}

export class Inventory {
  heaterList: any[] = [];
  heatersOut: number = null;
  hosesOut: number = null;
  tanksOut: number = null;
  brokenHeaters: number = null;
  stolenHeaters: number = null;
  lostHeaters: number = null;
  destroyedHeaters: number = null;
}