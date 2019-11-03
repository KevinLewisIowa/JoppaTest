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
import { Note } from 'app/models/note';
import { ClientPet } from 'app/models/client-pet';

@Component({
  selector: 'app-servicing-client',
  templateUrl: './servicing-client.component.html',
  styleUrls: ['./servicing-client.component.css']
})

export class ServicingClientComponent implements OnInit {
  appearance: Appearance;
  client: Client = new Client();
  locationCampId: number;
  requestedItems: RequestedItem[] = [];
  goalsAndSteps: GoalsNextStep[] = [];
  clientLikes: ClientLike[] = [];
  clientDislikes: ClientDislike[] = [];
  healthConcerns: HealthConcern[] = [];
  notes: Note[] = [];
  pets: ClientPet[] = [];
  sentInteraction = false;
  receivedItems: RequestedItem[] = [];
  heatRoute = false;
  tankInteractions: any[] = [];
  hoseInteractions: any[] = [];
  heatEquipmentNotReturned: any[] = [];
  clientId = null;
  heaterStatuses: HeaterStatus[] = [];
  heaters: any[] = [];
  isAdmin: boolean;
  constructor(private service: ClientService, private mainService: MainService, private router: Router) { }

  ngOnInit() {
    let routeInstanceId = JSON.parse(localStorage.getItem('routeInstance'));
    this.heatRoute = JSON.parse(window.localStorage.getItem('heatRoute'));
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.locationCampId = JSON.parse(window.localStorage.getItem('locationCampId'));
    this.clientId = localStorage.getItem('selectedClient');
    let routeAttendanceList:Appearance[] = JSON.parse(localStorage.getItem('RouteAttendance'));
    if (routeAttendanceList.length > 0) {
      this.appearance = routeAttendanceList.find(x => x.client_id == this.clientId);
    }

    if (this.appearance) {
      this.sentInteraction = true;
    }
    
    if (this.clientId !== null) {
      this.service.getClientById(this.clientId).subscribe((data: Client) => {
        this.client = data;
      });
      if (routeInstanceId != null) {
        this.service.getClientNotesForRoute(this.clientId, routeInstanceId).subscribe((data: Note[]) => {
          this.notes = data;
        }, error => console.log(error));
      }
      else if (this.isAdmin) {
        this.service.getClientNotesForClient(this.clientId).subscribe((data: Note[]) => {
          this.notes = data;
        }, error => console.log(error));
      }

      if (this.heatRoute) {
        // get heating equipment for this person
        this.service.getHeatersForClient(this.clientId).subscribe((data: Heater[]) => {
          this.heaters = data;
        });
        this.service.getClientLoanedTanks(this.clientId).subscribe((tankInteractions: any[]) => {
          // now get the tank info
          this.tankInteractions = tankInteractions;
        });
        this.service.getClientLoanedHoses(this.clientId).subscribe((hoseInteractions: any[]) => {
          // now get the Hose info
          this.hoseInteractions = hoseInteractions;
        });
        this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data: any[]) => {
          this.heatEquipmentNotReturned = data;
        });
        this.getHeaterStatuses();
      } else {
        this.service.getRecentReceivedItems(this.clientId).subscribe((data: RequestedItem[]) => {
          this.receivedItems = data;
        });
        this.service.getRequestedItems(this.clientId).subscribe((data: RequestedItem[]) => {
          this.requestedItems = data.filter(w => w.has_received != true);
        });
        // this.service.getClientPets(this.clientId).subscribe((data : ClientPet[]) => {
        //   this.pets = data;
        // });
        // this.service.getGoalsAndNextSteps(this.clientId).subscribe((data: GoalsNextStep[]) => {
        //   this.goalsAndSteps = data;
        // });
        // this.service.getClientLikes(this.clientId).subscribe((data: ClientLike[]) => {
        //   this.clientLikes = data;
        // });
        // this.service.getClientDislikes(this.clientId).subscribe((data: ClientDislike[]) => {
        //   this.clientDislikes = data;
        // });
        // this.service.getHealthConcerns(this.clientId).subscribe((data: HealthConcern[]) => {
        //   this.healthConcerns = data;
        // });
      }
    }
    else {
      this.router.navigate(['/routes']);
    }

    if (this.client.birth_date == null) {
      alert('Please ask this client for their birthday');
    }
  }

  getHeaterStatuses(): void {
    this.mainService.getHeaterStatuses().subscribe(heaterStatuses => {
      this.heaterStatuses = heaterStatuses.filter(w => w.id !== 1);
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
      this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data1: any[]) => {
        this.heatEquipmentNotReturned = data1;
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
    } else if (interactionType === 4) {
      interaction.serviced = false;
      interaction.still_lives_here = true;
      interaction.was_seen = false;
    }

    let routeAttendanceList:Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
    console.log(routeAttendanceList.toString());
    let appearance:Appearance = routeAttendanceList.find(x => x.client_id == this.client.id);

    if (appearance) {
      routeAttendanceList[routeAttendanceList.indexOf(appearance)] = interaction;
    }
    else {
      routeAttendanceList.push(interaction);
    }

    window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
    this.router.navigate([`/locationCamp/${this.locationCampId}`]);
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

  noteAdded(note: Note) {
    this.notes.push(note);
    const element = document.querySelector('#notes');
    element.scrollIntoView();
  }

  petAdded(pet: ClientPet) {
    this.pets.push(pet);
    const element = document.querySelector('#petList');
    element.scrollIntoView();
  }

  goToTop() {
    const element = document.querySelector('#topOfScreen');
    element.scrollIntoView();
  }

  back() {
    if(this.isAdmin) {
      if (confirm('Are you wanting to go back to the client listing?')) {
        this.router.navigate(['/admin/clientListing']);
      }
      else {
        this.router.navigate([`/locationCamp/${this.locationCampId}`]);
      }
    }
    else {
      if (!this.sentInteraction) {
        if (!confirm('Are you sure you want to close out of this client? You have not yet marked them as seen or serviced.')) {
          return;
        }
      }
  
      this.router.navigate([`/locationCamp/${this.locationCampId}`]);
    }
  }

  deleteRequest(id) {
    this.service.deletedRequestedItem(id).subscribe(response => {
      this.requestedItems = this.requestedItems.filter(w => w.id != id);
    })
  }

  removeLike(id) {
    this.service.removeLike(id).subscribe(response => {
      console.log(this.clientLikes);
      this.clientLikes = this.clientLikes.filter(w => w.id != id);
    })
  }

  removeDislike(id) {
    this.service.removeDislike(id).subscribe(response => {
      console.log(this.clientDislikes);
      this.clientDislikes = this.clientDislikes.filter(w => w.id != id);
    })
  }

  removeGoal(id) {
    this.service.deleteGoalAndNextStep(id).subscribe(response => {
      this.goalsAndSteps = this.goalsAndSteps.filter(w => w.id != id);
    })
  }

  removePet(id) {
    this.service.removePet(id).subscribe(response => {
      console.log(this.pets);
      this.pets = this.pets.filter(w => w.id != id);
    })
  }

  removeHealthConcern(id) {
    this.service.removeHealthConcern(id).subscribe(response => {
      this.healthConcerns = this.healthConcerns.filter(w => w.id != id);
    })
  }

  removeNote(id: number) {
    this.service.removeNote(id).subscribe(response => {
      this.notes = this.notes.filter(w => w.id != id);
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
      });
    });
  }

  loanTank() {
    if (this.clientId != null) {
      this.service.loanTank(this.clientId).subscribe(response => {
        this.service.getClientLoanedTanks(this.clientId).subscribe((data: any) => {
          this.tankInteractions = data;
        });
      });
    }
  }

  loanHose() {
    if (this.clientId != null) {
      this.service.loanHose(this.clientId).subscribe(response => {
        this.service.getClientLoanedHoses(this.clientId).subscribe((data: any) => {
          this.hoseInteractions = data;
        });
      });
    }
  }

  submitTankStatus(interactionId, statusId) {
    if (statusId != 2) {
      this.service.updateTankInteraction(interactionId, statusId).subscribe(data => {
        this.service.getClientLoanedTanks(this.clientId).subscribe((response: any[]) => {
          this.tankInteractions = response;
        });
        this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data1: any[]) => {
          this.heatEquipmentNotReturned = data1;
        });
      });
    }
  }

  submitHoseStatus(interactionId, statusId) {
    if (statusId != 2) {
      this.service.updateHoseInteraction(interactionId, statusId).subscribe(data => {
        this.service.getClientLoanedHoses(this.clientId).subscribe((response: any[]) => {
          this.hoseInteractions = response;
        });
        this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data1: any[]) => {
          this.heatEquipmentNotReturned = data1;
        });
      });
    }
  }

  submitHeaterStatus(interactionId, statusId) {
    if (statusId != 2) {
      this.service.updateHeaterInteraction(interactionId, statusId).subscribe(data => {
        this.service.getHeatersForClient(this.clientId).subscribe((response: any[]) => {
          this.heaters = response;
        });
        this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data1: any[]) => {
          this.heatEquipmentNotReturned = data1;
        });
      });
    }
  }
}
