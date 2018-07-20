import { Component, OnInit } from '@angular/core';
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { Appearance } from "app/models/appearance";
import { RequestedItem } from "app/models/requested-item";
import { GoalsNextStep } from "app/models/goals-next-steps";
import { ClientLike } from "app/models/client-like";
import { ClientDislike } from "app/models/client-dislike";
import { HealthConcern } from "app/models/health-concern";

@Component({
  selector: 'app-servicing-client',
  templateUrl: './servicing-client.component.html',
  styleUrls: ['./servicing-client.component.css']
})
export class ServicingClientComponent implements OnInit {
  client: Client = new Client();
  locationCampId: number;
  requestedItems: RequestedItem[] = [];
  goalsAndSteps: GoalsNextStep[] = [];
  clientLikes: ClientLike[] = [];
  clientDislikes: ClientDislike[] = [];
  healthConcerns: HealthConcern[] = [];
  sentInteraction = false;
  constructor(private service: ClientService, private router: Router) { }

  ngOnInit() {
    this.locationCampId = Number(sessionStorage.getItem('locationCampId'));
    const clientId = sessionStorage.getItem('selectedClient');
    if (clientId !== null) {
      this.service.getClientById(clientId).subscribe((data: Client) => {
        this.client = data;
      });
      this.service.getGoalsAndNextSteps(clientId).subscribe((data: GoalsNextStep[]) => {
        this.goalsAndSteps = data;
      });
      this.service.getRequestedItems(clientId).subscribe((data: RequestedItem[]) => {

        this.requestedItems = data.filter(w => w.has_received != true);
      });
      this.service.getClientLikes(clientId).subscribe((data: ClientLike[]) => {
        this.clientLikes = data;
      });
      this.service.getClientDislikes(clientId).subscribe((data: ClientDislike[]) => {
        this.clientDislikes = data;
      });
      this.service.getHealthConcerns(clientId).subscribe((data: HealthConcern[]) => {
        this.healthConcerns = data;
      });
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

  requestedItemAdded(item: RequestedItem) {
    this.requestedItems.push(item);
    const element = document.querySelector('#items');
    element.scrollIntoView();
  }

  likeAdded(like: ClientLike) {
    this.clientLikes.push(like);
    const element = document.querySelector('#likes');
    element.scrollIntoView();
  }

  dislikeAdded(dislike: ClientDislike) {
    this.clientDislikes.push(dislike);
    const element = document.querySelector('#dislikes');
    element.scrollIntoView();
  }

  healthConcernAdded(concern: HealthConcern) {
    this.healthConcerns.push(concern);
    const element = document.querySelector('#concerns');
    element.scrollIntoView();
  }

  goalAdded(goal: GoalsNextStep) {
    this.goalsAndSteps.push(goal);
    const element = document.querySelector('#goals');
    element.scrollIntoView();
  }

  goToTop() {
    const element = document.querySelector('#topOfScreen');
    element.scrollIntoView();
  }

  back() {
    this.router.navigate([`/locationCamp/${this.locationCampId}`]);
  }

  deleteRequest(id) {
    this.service.deletedRequestedItem(id).subscribe(response => {
      this.requestedItems = this.requestedItems.filter(w => w.id != id);
    })
  }

  receivedRequest(id) {
    this.service.receivedRequestedItem(id).subscribe(response => {
      this.requestedItems = this.requestedItems.filter(w => w.id != id);
    })
  }
}