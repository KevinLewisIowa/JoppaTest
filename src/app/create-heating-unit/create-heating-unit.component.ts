import { Component, OnInit } from '@angular/core';
import { Heater } from '../models/heater';
import { HeaterType } from '../models/heater-type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { HeaterStatus } from '../models/heater-status';

@Component({
  selector: 'app-create-heating-unit',
  templateUrl: './create-heating-unit.component.html',
  styleUrls: ['./create-heating-unit.component.css']
})
export class CreateHeatingUnitComponent implements OnInit {
  theHeater: Heater;
  heaterForm: FormGroup;
  heaterTypes: HeaterType[];
  heaterStatuses: HeaterStatus[];

  constructor(private mainService: MainService, private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.getHeaterTypes();
    this.getHeaterStatuses();
    this.theHeater = new Heater();
    this.heaterForm = this.fb.group({
      heater_type_id: '',
      heater_status_id: '',
      serial_number: '',
      is_active: true
    });
    this.heaterForm.get('heater_type_id').setValidators(Validators.required);
    this.heaterForm.get('serial_number').setValidators(Validators.required);
    this.heaterForm.get('heater_status_id').setValidators(Validators.required);
  }

  getHeaterTypes(): void {
    this.mainService.getHeaterTypes().subscribe(heaterTypes => {
      this.heaterTypes = heaterTypes;
    }, err => {console.log(err)});
  }

  getHeaterStatuses(): void {
    this.mainService.getHeaterStatuses().subscribe(heaterStatuses => {
      this.heaterStatuses = heaterStatuses;
    }, err => {console.log(err)});
  }

  back() {
    this.router.navigate([`adminHome`]);
  }

  submitHeater() {
    this.theHeater.serial_number = this.heaterForm.get('serial_number').value;
    this.theHeater.heater_type_id = this.heaterForm.get('heater_type_id').value;
    this.theHeater.heater_status_id = this.heaterForm.get('heater_status_id').value;
    this.theHeater.is_active = true;
    this.mainService.insertHeater(this.theHeater).subscribe(data => {
      this.router.navigate([`adminHome`]);
    });
  }

}
