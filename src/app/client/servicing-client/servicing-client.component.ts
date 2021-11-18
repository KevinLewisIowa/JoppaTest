import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faInfoCircle, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { PrayerRequestAndNeed } from 'app/models/prayer-request';
import { ConfirmDialogModel, CustomConfirmationDialogComponent } from 'app/custom-confirmation-dialog/custom-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  prayerRequestsAndNeeds: PrayerRequestAndNeed[] = [];
  householdClients: Client[] = [];
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
  currentStatus: number = 2;
  heaters: any[] = [];
  clientInteractions: any[] = [];
  isAdmin: boolean;
  attendanceFromDate: string;
  attendanceToDate: string;
  updateTimerSubscription: Subscription;
  updateHoseTankMessageVisible: boolean = false;
  backIcon = faChevronLeft;
  informationIcon = faInfoCircle;
  seenAndServicedIcon = faCheckCircle;
  notSeenAndServicedIcon = farCheckCircle;
  notSeenIcon = faTimesCircle;
  routeInstanceId: number;
  pipe: DatePipe = new DatePipe('en-us');

  @ViewChild('clientInfo', {static: false}) clientInfo: ElementRef;

  constructor(private service: ClientService, private mainService: MainService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.routeInstanceId = JSON.parse(localStorage.getItem('routeInstance'));
    console.log(this.routeInstanceId);
    this.heatRoute = JSON.parse(window.localStorage.getItem('heatRoute'));
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
    this.locationCampId = JSON.parse(window.localStorage.getItem('locationCampId'));
    this.clientId = localStorage.getItem('selectedClient');

    let attendToDate: Date = new Date();
    attendToDate.setDate(attendToDate.getDate() + 1);
    this.attendanceToDate = this.pipe.transform(attendToDate, 'yyyy-MM-dd');
    let attendFromDate: Date = new Date();
    attendFromDate.setMonth(attendFromDate.getMonth() - 1);
    this.attendanceFromDate = this.pipe.transform(attendFromDate, 'yyyy-MM-dd');
    let routeAttendanceList:Appearance[] = JSON.parse(localStorage.getItem('RouteAttendance'));
    if (routeAttendanceList.length != null) {
      this.appearance = routeAttendanceList.find(x => x.client_id == this.clientId);
    }
    else {
      routeAttendanceList = [];
      window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
    }

    if (this.appearance) {
      this.sentInteraction = true;
    }
    
    if (this.clientId !== null) {
      this.service.getClientById(this.clientId).subscribe((data: Client) => {
        this.client = data;
        
        if (this.client.homeless_reason == '' || this.client.date_became_homeless == null) {
          alert('Please ask this client 1) If this is first time homeless? 2) Why they are homeless? and 3) When they became homeless? Please record this in the Client Details screen, where you will be directed now.');
          if (!this.isAdmin) {
            this.clientInfo.nativeElement.click();
          }
        }

        this.service.getClientHousehold(this.client.household_id).subscribe((data: Client[]) => {
          this.householdClients = data;
        }, error => console.log(error));
      });
      if (this.routeInstanceId != null) {
        this.service.getClientNotesForRoute(this.clientId, this.routeInstanceId).subscribe((data: Note[]) => {
          this.notes = data;
        }, error => console.log(error));
      }
      
      if (this.isAdmin) {
        this.service.getClientNotesForClient(this.clientId).subscribe((data: Note[]) => {
          this.notes = data;
        }, error => console.log(error));
        this.service.getRecentReceivedItems(this.clientId).subscribe((data: RequestedItem[]) => {
          this.receivedItems = data;
        }, error => console.log(error));
        this.service.getRequestedItems(this.clientId).subscribe((data: RequestedItem[]) => {
          this.requestedItems = data.filter(w => w.has_received != true);
        }, error => console.log(error));
        this.service.getClientPets(this.clientId).subscribe((data : ClientPet[]) => {
          this.pets = data;
        }, error => console.log(error));
        this.service.getGoalsAndNextSteps(this.clientId).subscribe((data: GoalsNextStep[]) => {
          this.goalsAndSteps = data;
        }, error => console.log(error));
        this.service.getClientLikes(this.clientId).subscribe((data: ClientLike[]) => {
          this.clientLikes = data;
        }, error => console.log(error));
        this.service.getClientDislikes(this.clientId).subscribe((data: ClientDislike[]) => {
          this.clientDislikes = data;
        }, error => console.log(error));
        this.service.getHealthConcerns(this.clientId).subscribe((data: HealthConcern[]) => {
          this.healthConcerns = data;
        }, error => console.log(error));
        this.service.getHeatersForClient(this.clientId).subscribe((data: Heater[]) => {
          this.heaters = data;
        }, error => console.log(error));
        this.service.getClientPrayerRequests(this.clientId).subscribe((data: PrayerRequestAndNeed[]) => {
          this.prayerRequestsAndNeeds = data;
        }, error => console.log(error));
        // this.service.getClientLoanedTanks(this.clientId).subscribe((tankInteractions: any[]) => {
        //   // now get the tank info
        //   this.tankInteractions = tankInteractions;
        // });
        // this.service.getClientLoanedHoses(this.clientId).subscribe((hoseInteractions: any[]) => {
        //   // now get the Hose info
        //   this.hoseInteractions = hoseInteractions;
        // });
        this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data: any[]) => {
          this.heatEquipmentNotReturned = data;
        }, error => console.log(error));
        this.getHeaterStatuses();
        this.mainService.getClientAttendanceHistory(this.clientId, this.pipe.transform(this.attendanceFromDate, 'yyyy-MM-dd'), this.pipe.transform(this.attendanceToDate, 'yyyy-MM-dd')).subscribe((data: any[]) => {
          this.clientInteractions = data;
        }, error => console.log(error));
      }

      if (this.heatRoute) {
        // get heating equipment for this person
        this.service.getHeatersForClient(this.clientId).subscribe((data: Heater[]) => {
          this.heaters = data;
        });
        // this.service.getClientLoanedTanks(this.clientId).subscribe((tankInteractions: any[]) => {
        //   // now get the tank info
        //   this.tankInteractions = tankInteractions;
        // });
        // this.service.getClientLoanedHoses(this.clientId).subscribe((hoseInteractions: any[]) => {
        //   // now get the Hose info
        //   this.hoseInteractions = hoseInteractions;
        // });
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
        this.service.getClientPets(this.clientId).subscribe((data : ClientPet[]) => {
          this.pets = data;
        });
        this.service.getGoalsAndNextSteps(this.clientId).subscribe((data: GoalsNextStep[]) => {
          this.goalsAndSteps = data;
        });
        this.service.getClientLikes(this.clientId).subscribe((data: ClientLike[]) => {
          this.clientLikes = data;
        });
        this.service.getClientDislikes(this.clientId).subscribe((data: ClientDislike[]) => {
          this.clientDislikes = data;
        });
        this.service.getHealthConcerns(this.clientId).subscribe((data: HealthConcern[]) => {
          this.healthConcerns = data;
        });
      }
    }
    else {
      this.router.navigate(['/routes']);
    }
  }

  searchWeeklyAttendance() {
    this.mainService.getClientAttendanceHistory(this.clientId, this.pipe.transform(this.attendanceFromDate, 'yyyy-MM-dd'), this.pipe.transform(this.attendanceToDate, 'yyyy-MM-dd')).subscribe((data: any[]) => {
      this.clientInteractions = data;
    }, error => console.log(error));
  }

  ngOnDestroy() {
    if (this.updateTimerSubscription) {
      this.updateHoseTankMessageVisible = false;
      this.updateTimerSubscription.unsubscribe();
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

  heaterStatusChanged(status_id: number) {
    this.currentStatus = status_id;
  }

  updateHeaterEntry(heaterId, statusId) {
    this.service.updateHeaterClient(this.client.id, heaterId, statusId).subscribe(response => {
      this.service.getHeatersForClient(this.client.id).subscribe((data: any[]) => {
        this.heaters = data;
      }, error => console.log(error));
      this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data1: any[]) => {
        this.heatEquipmentNotReturned = data1;
      });
    });
  }

  updateNumberTanksHoses(client: Client) {
    this.service.updateClient(client).subscribe(data => {
      let updateTimer = timer(2000, 2000);
      this.updateTimerSubscription = updateTimer.subscribe(data => {
        this.hideConfirmationMessage()
      });
      this.updateHoseTankMessageVisible = true;
    }, error => console.log(error));
  }

  hideConfirmationMessage(): any {
    this.updateHoseTankMessageVisible = false;
    this.updateTimerSubscription.unsubscribe();
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
    let appearance:Appearance = routeAttendanceList.find(x => x.client_id == interaction.client_id);
    
    if (appearance) {
      interaction.id = appearance.id;

      this.service.updateClientAppearance(interaction).subscribe(data => {
        routeAttendanceList[routeAttendanceList.indexOf(appearance)] = interaction;
        
        this.updateClientAndAttendanceListing(interaction, routeAttendanceList);
      }, error => console.log(error));
    }
    else {
      this.service.insertClientAppearance(interaction).subscribe(data => {
        interaction.id = data.id;
        routeAttendanceList.push(interaction);
        
        this.updateClientAndAttendanceListing(interaction, routeAttendanceList);
      }, error => console.log(error));
    }
  }

  updateClientAndAttendanceListing(interaction: Appearance, routeAttendanceList: Appearance[]) {
    if (interaction.serviced) {
      this.client.last_interaction_date = new Date();
    }
    else if (interaction.still_lives_here == false) {
      this.client.previous_camp_id = interaction.location_camp_id;
      this.client.current_camp_id = null;
    }
    this.service.updateClient(this.client).subscribe(data => {
      window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendanceList));
      console.log('Number of interactions in route attendance list: ' + routeAttendanceList.length);
      console.log(JSON.stringify(routeAttendanceList));
      this.router.navigate([`/locationCamp/${this.locationCampId}`]);
    }, error => console.log(error));
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

  prayerRequestNeedAdded(request: PrayerRequestAndNeed) {
    this.prayerRequestsAndNeeds.push(request);
    const element = document.querySelector('#prayerRequestsNeeds');
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

  clientSelected(client: Client) {
    this.householdClients.push(client);
    
    client.household_id = this.client.household_id;
    this.service.updateClient(client).subscribe(data => {
    }, error => console.log(error));
  }

  goToTop() {
    const element = document.querySelector('#topOfScreen');
    element.scrollIntoView();
  }

  back() {
    let title: string = 'Confirm Action';
    let confirmText: string = 'Yes';
    let dismissText: string = 'No';
    let message: string;

    if(this.isAdmin) {
      this.router.navigate(['/admin/clientListing']);
    }
    else {
      if (!this.sentInteraction) {
        message = 'Are you sure you want to close out of this client? You have not yet marked them as seen or serviced.';
        const dialogData = new ConfirmDialogModel(title, message, confirmText, dismissText);
        const dialogRef = this.dialog.open(CustomConfirmationDialogComponent, {data: dialogData, maxWidth:'400px'});

        dialogRef.afterClosed().subscribe(result => {
          let canContinue: boolean = JSON.parse(result);

          if (!canContinue) {
            return;
          }

          this.router.navigate([`/locationCamp/${this.locationCampId}`]);
        });
      }
      else {
        this.router.navigate([`/locationCamp/${this.locationCampId}`]);
      }
    }
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

  removePet(id) {
    this.service.removePet(id).subscribe(response => {
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

  removePrayerRequestNeed(id: number) {
    this.service.removePrayerRequestNeed(id).subscribe(response => {
      this.prayerRequestsAndNeeds = this.prayerRequestsAndNeeds.filter(w => w.id != id);
    });
  }

  removeHouseholdClient(client: Client) {
    client.household_id = client.id;
    
    if (this.client.id == client.household_id) {
      this.client.household_id = client.id;
    }
    
    this.service.updateClient(client).subscribe(data => {
      this.service.getClientHousehold(this.clientId).subscribe((data: Client[]) => {
        this.householdClients = data;
      });
    });
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

  loanHeater() {
    if (this.clientId != null) {
      let newHeater: Heater = new Heater();
      newHeater.serial_number = "Heater";
      newHeater.heater_type_id = 1;
      newHeater.heater_status_id = 2;
      newHeater.is_active = true;

      this.mainService.insertHeater(newHeater).subscribe((response:Heater) => {
        this.updateHeaterEntry(response.id, 2);
        this.getHeaterStatuses();
      }, error => console.log(error));
      
    }
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
