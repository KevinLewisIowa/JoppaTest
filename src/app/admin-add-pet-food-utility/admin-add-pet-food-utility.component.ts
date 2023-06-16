import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'app/services/client.service';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ClientPet } from 'app/models/client-pet';
import { RequestedItem } from 'app/models/requested-item';
import { Client } from 'app/models/client';

@Component({
  selector: 'app-admin-add-pet-food-utility',
  templateUrl: './admin-add-pet-food-utility.component.html',
  styleUrls: ['./admin-add-pet-food-utility.component.css']
})
export class AdminAddPetFoodUtilityComponent implements OnInit {

  clientsPets: any[] = [];
  countItemsAdded = 0;
  petFoodAdderRunning: boolean = false;
  processComplete: boolean = false;
  backIcon = faChevronLeft;

  constructor(private clientService: ClientService, private router: Router) { }

  addPetFood() {
    this.petFoodAdderRunning = true;
    this.processComplete = false;
    this.clientService.getAllClientPets().subscribe((data: ClientPet[]) => {
      console.log(JSON.stringify(data));
      this.clientsPets = data.filter(p => p.food_requested == true);
      var numClients = this.clientsPets.length;
      console.log(`Number of pets requesting food: ${numClients}`);

      var i = 0;
      if (numClients == 0) {
        this.petFoodAdderRunning = false;
        this.processComplete = true;
      } else {
        this.clientsPets.forEach((clientPet: ClientPet) => {
          i++;

          this.clientService.getClientById(clientPet.client_id).subscribe((client: Client) => {
            if (client.status == "Active" && client.current_camp_id != null && client.current_camp_id != 449) {
              // Create new item request
              let newItem: RequestedItem = new RequestedItem();
              newItem.client_id = clientPet.client_id;
              newItem.date_requested = new Date();
              newItem.fulfilled = false;
              newItem.has_received = false;
              newItem.item_description = clientPet.pet_type + " Food";

              this.clientService.insertRequestedItem(newItem).subscribe((data: RequestedItem) => {
                if (data != null && data.id != null) {
                  this.countItemsAdded = this.countItemsAdded + 1;

                  console.log(`Client Active. Number items added: ${this.countItemsAdded}`);

                  if (i == numClients) {
                    this.petFoodAdderRunning = false;
                    this.processComplete = true;
                  }
                }
              });
            } else {
              console.log(`Client not active. Number items added: ${this.countItemsAdded}`);

              if (i == numClients) {
                this.petFoodAdderRunning = false;
                this.processComplete = true;
              }
            }
          })
        });
      }
    });
  }

  ngOnInit(): void {
  }

}
