import { Component, OnInit } from '@angular/core';
import { Heater } from '../models/heater';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-heaters',
  templateUrl: './checkout-heaters.component.html',
  styleUrls: ['./checkout-heaters.component.css']
})
export class CheckoutHeatersComponent implements OnInit {
  heaters: any[];

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
    this.mainService.getAvailableHeaters().subscribe(heaterList => {
      this.heaters = heaterList;
    })
  }

}
