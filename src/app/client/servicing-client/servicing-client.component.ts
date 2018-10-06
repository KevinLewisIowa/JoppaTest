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
import { HeaterStatus } from '../../models/heater-status';
import { MainService } from '../../services/main.service';
import { Heater } from 'app/models/heater';

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
  receivedItems: RequestedItem[] = [];
  heatRoute = false;
  heaterStatuses: HeaterStatus[] = [];
  heaters: any[] = [];
  constructor(private service: ClientService, private mainService: MainService, private router: Router) { }

  ngOnInit() {
    if (window.localStorage.getItem('routeType') === 'heat') {
      this.heatRoute = true;
    }
    this.locationCampId = Number(sessionStorage.getItem('locationCampId'));
    const clientId = sessionStorage.getItem('selectedClient');
    if (clientId !== null) {
      this.service.getClientById(clientId).subscribe((data: Client) => {
        this.client = data;
      });
      this.service.getRecentReceivedItems(clientId).subscribe((data: RequestedItem[]) => {
        this.receivedItems = data;
      });
      this.service.getRequestedItems(clientId).subscribe((data: RequestedItem[]) => {
        this.requestedItems = data.filter(w => w.has_received != true);
      });

      if (this.heatRoute) {
        // get heating equipment for this person
        this.service.getHeatersForClient(clientId).subscribe((data: Heater[]) => {
          this.heaters = data;
        });
        this.getHeaterStatuses();
      } else {
        this.service.getGoalsAndNextSteps(clientId).subscribe((data: GoalsNextStep[]) => {
          this.goalsAndSteps = data;
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
      }
    } else {
      this.router.navigate(['/routes']);
    }
  }

  getHeaterStatuses(): void {
    this.mainService.getHeaterStatuses().subscribe(heaterStatuses => {
      this.heaterStatuses = heaterStatuses.filter(w => w.id !== 1 && w.id !== 2);
    }, err => {console.log(err)} );
  }

  loaningHeater(heaterId) {
    this.updateHeaterEntry(heaterId, 2);
  }

  updateHeaterEntry(heaterId, statusId) {
    this.service.updateHeaterClient(this.client.id, heaterId, statusId).subscribe(response => {
      this.service.getHeatersForClient(this.client.id).subscribe((data: any[]) => {
        console.log(data);
        this.heaters = data;
      });
    });
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

  editedClient(theClient: Client) {
    this.client = theClient;
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

  removeLike(id) {
    this.service.removeLike(id).subscribe(response => {
      this.clientLikes = this.clientLikes.filter(w => w.id != id);
    })
  }

  removeDislike(id) {
    this.service.removeDislike(id).subscribe(response => {
      this.clientDislikes = this.clientDislikes.filter(w => w.id != id);
    })
  }

  removeGoal(id) {
    this.service.deleteGoalAndNextStep(id).subscribe(response => {
      this.goalsAndSteps = this.goalsAndSteps.filter(w => w.id != id);
    })
  }

  removeHealthConcern(id) {
    this.service.removeHealthConcern(id).subscribe(response => {
      this.healthConcerns = this.healthConcerns.filter(w => w.id != id);
    })
  }

  completedGoal(goal: GoalsNextStep) {
    goal.is_completed = true;
    this.service.completeGoalAndNextStep(goal).subscribe(response => {
      this.goalsAndSteps = this.goalsAndSteps.filter(w => w.id != goal.id);
    })
  }

  receivedRequest(id) {
    this.service.receivedRequestedItem(id).subscribe(response => {
      this.requestedItems = this.requestedItems.filter(w => w.id != id);
      this.service.getRecentReceivedItems(this.client.id).subscribe((data: RequestedItem[]) => {
        this.receivedItems = data;
      })
    })
  }
}
