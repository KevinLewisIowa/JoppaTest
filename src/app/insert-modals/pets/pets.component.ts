import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ClientPet } from 'app/models/client-pet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {
  @ViewChild('petsMdl') petsMdl: ElementRef
  @Output() petAdded = new EventEmitter<ClientPet>();
  pet_type: string;
  quantity: number;
  placeholderText: string = '';
  food_requested: boolean = true;
  extraInfoNeeded: boolean = false;
  species: string = '';
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.petsMdl, {size: 'lg', backdrop: 'static'});
  }

  onChange(selectedPet: string) {
    switch (true) {
      case selectedPet === 'Dog':
        this.extraInfoNeeded = false;
        break;
      case selectedPet === 'Cat':
        this.extraInfoNeeded = false;
        break;
      case selectedPet === 'Other':
        this.extraInfoNeeded = true;
        break;
      default:
        this.extraInfoNeeded = false;
        break;
    }
  }

  submitPet() {
    const pet = new ClientPet();
    const clientId = JSON.parse(localStorage.getItem('selectedClient'));
    if (this.pet_type != null && !isNaN(clientId) && !isNaN(this.quantity) && this.quantity > 0) {
      pet.pet_type = this.pet_type;
      pet.species = this.species;
      pet.client_id = clientId;
      pet.quantity = this.quantity;
      pet.food_requested = this.food_requested;
      if (this.extraInfoNeeded && (pet.species === '' || pet.species === null)) {
        alert('Need to enter species of pet');
      }
      this.service.insertPet(pet).subscribe((data: ClientPet) => {
        if (data != null && data.id != null) {
          this.petAdded.emit(data);
        }
      }, error => console.log(error));
      console.log(pet.species);
    }
  }

}
