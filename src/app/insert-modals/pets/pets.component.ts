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
  extraInfo: string;
  placeholderText: string = '';
  food_requested: boolean = true;
  extraInfoNeeded: boolean = false;
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
      if (this.extraInfoNeeded && (this.extraInfo === '' || this.extraInfo === null)){ 
          alert('Need to enter species of pet');
        } else {
          pet.pet_type = this.extraInfo;
        }
      } else {
        pet.pet_type = this.pet_type;
      }
      pet.client_id = clientId;
      pet.quantity = this.quantity;
      pet.food_requested = this.food_requested;
      this.service.insertPet(pet).subscribe((data: ClientPet) => {
        if (data != null && data.id != null) {
          this.petAdded.emit(data);
        }
      }, error => console.log(error));
    }
  }
