import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ClientPet } from 'app/models/client-pet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit, AfterViewChecked {

  @ViewChild('petsMdl', { static: false }) petsMdl: ElementRef
  @Output() petAdded = new EventEmitter<ClientPet>();
  pet_type: string = '';
  age: number;
  pet_name: string;
  extraInfo: string;
  breed: string;
  placeholderText: string = '';
  food_requested: boolean = true;
  extraInfoNeeded: boolean = false;
  constructor(private modalService: NgbModal, private service: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement && this.extraInfo == '') {
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.petsMdl, { size: 'lg', backdrop: 'static' });

    this.pet_type = '';
    this.pet_name = '';
    this.age = null;
    this.breed = '';
    this.food_requested = true;
  }

  onChange() {
    if (this.pet_type == 'Other') {
      this.extraInfoNeeded = true;
      this.placeholderText = 'Species';
    }
    else {
      this.extraInfoNeeded = false;
    }
  }

  submitPet() {
    const pet = new ClientPet();
    const clientId = JSON.parse(localStorage.getItem('selectedClient'));
    if (this.pet_type != null && !isNaN(clientId) && !isNaN(this.age)) {
      if (this.extraInfoNeeded && (this.extraInfo === '' || this.extraInfo === null)) {
        alert('Need to enter species of pet');
      } else if (this.extraInfoNeeded) {
        this.pet_type = this.extraInfo;
      }
    }

    pet.pet_type = this.pet_type;
    pet.client_id = clientId;
    pet.pet_name = this.pet_name;
    pet.age = this.age;
    pet.breed = this.breed;
    pet.food_requested = this.food_requested;

    this.service.insertPet(pet).subscribe((data: ClientPet) => {
      if (data != null && data.id != null) {
        this.petAdded.emit(data);
      }
    }, error => console.log(error));
  }
}
