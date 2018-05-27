import { Component, OnInit } from '@angular/core';
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { Appearance } from "app/models/appearance";

@Component({
  selector: 'app-servicing-client',
  templateUrl: './servicing-client.component.html',
  styleUrls: ['./servicing-client.component.css']
})
export class ServicingClientComponent implements OnInit {
  client: Client = new Client();
  locationCampId: number;
  sentInteraction = false;
  constructor(private service: ClientService, private router: Router) { }

  ngOnInit() {
    this.locationCampId = Number(sessionStorage.getItem('locationCampId'));
    const clientId = sessionStorage.getItem('selectedClient');
    if (clientId !== null) {
      this.service.getClientById(clientId).subscribe((data: Client) => {
        this.client = data;
      })
    } else {
      this.router.navigate(['/routes']);
    }
  }

  sendInteraction(interactionType: number) {
    const interaction: Appearance = new Appearance();
    interaction.client_id = this.client.id;
    interaction.location_camp_id = this.locationCampId;
    if (interactionType === 1) {
      interaction.serviced = true;
      interaction.was_seen = true;
      interaction.still_lives_here = true;
    } else if (interactionType === 2) {
      interaction.serviced = true;
      interaction.still_lives_here = true;
      interaction.was_seen = false;
    } else if (interactionType === 3) {
      interaction.serviced = false;
      interaction.still_lives_here = false;
      interaction.was_seen = false;
    } else if (interactionType === 4) {
      interaction.still_lives_here = true;
      interaction.serviced = false;
      interaction.was_seen = true;
    }
    this.sentInteraction = true;
    this.service.insertClientAppearance(interaction);
  }

  back() {
    this.router.navigate([`/locationCamp/${this.locationCampId}`]);
  }
}
