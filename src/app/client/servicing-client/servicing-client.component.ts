import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Router } from "@angular/router";
import { Appearance } from "app/models/appearance";
import { RequestedItem } from "app/models/requested-item";
import { GoalsNextStep } from "app/models/goals-next-steps";
import { ClientLike } from "app/models/client-like";
import { ClientDislike } from "app/models/client-dislike";
import { HealthConcern } from "app/models/health-concern";
import { HeaterStatus } from "../../models/heater-status";
import { MainService } from "../../services/main.service";
import { Heater } from "app/models/heater";
import { Note } from "app/models/note";
import { ClientPet } from "app/models/client-pet";
import { Tent } from "app/models/tent";
import { ClientDwelling } from "app/models/client-dwelling";
import { ClientCircleOfFriends } from "app/models/client-circle-of-friends";
import { ReferralsResources } from "app/models/referrals-resources";
import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Subscription, timer } from "rxjs";
import { DatePipe } from "@angular/common";
import { PrayerRequestAndNeed } from "app/models/prayer-request";
import {
  ConfirmDialogModel,
  CustomConfirmationDialogComponent,
} from "app/custom-confirmation-dialog/custom-confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DateSelectorComponent } from "app/insert-modals/date-selector/date-selector.component";

@Component({
  selector: "app-servicing-client",
  templateUrl: "./servicing-client.component.html",
  styleUrls: ["./servicing-client.component.css"],
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
  tents: Tent[] = [];
  dwellings: ClientDwelling[] = [];
  circleOfFriends: ClientCircleOfFriends[] = [];
  referralsResources: ReferralsResources[] = [];
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
  campId: number;
  url: any;
  backIcon = faChevronLeft;
  informationIcon = faInfoCircle;
  seenAndServicedIcon = faCheckCircle;
  notSeenAndServicedIcon = farCheckCircle;
  notSeenIcon = faTimesCircle;
  routeInstanceId: number;
  pinnedNoteString: string = '';
  pipe: DatePipe = new DatePipe("en-us");

  @ViewChild("clientInfo", { static: false }) clientInfo: ElementRef;

  constructor(
    private service: ClientService,
    private mainService: MainService,
    private modalService: NgbModal,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.routeInstanceId = JSON.parse(localStorage.getItem("routeInstance"));
    console.log(this.routeInstanceId);
    this.heatRoute = JSON.parse(window.localStorage.getItem("heatRoute"));
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
    this.locationCampId = JSON.parse(
      window.localStorage.getItem("locationCampId")
    );
    this.clientId = localStorage.getItem("selectedClient");

    let attendToDate: Date = new Date();
    attendToDate.setDate(attendToDate.getDate() + 1);
    this.attendanceToDate = this.pipe.transform(attendToDate, "yyyy-MM-dd");
    let attendFromDate: Date = new Date();
    attendFromDate.setMonth(attendFromDate.getMonth() - 1);
    this.attendanceFromDate = this.pipe.transform(attendFromDate, "yyyy-MM-dd");
    let routeAttendanceList: Appearance[] = JSON.parse(
      localStorage.getItem("RouteAttendance")
    );
    if (routeAttendanceList.length != null) {
      this.appearance = routeAttendanceList.find(
        (x) => x.client_id == this.clientId
      );
    } else {
      routeAttendanceList = [];
      window.localStorage.setItem(
        "RouteAttendance",
        JSON.stringify(routeAttendanceList)
      );
    }

    if (this.appearance) {
      this.sentInteraction = true;
    }

    if (this.clientId !== null) {
      this.service.getClientById(this.clientId).subscribe((data: Client) => {
        this.client = data;
        if (this.client.client_picture != null && this.client.client_picture != '') {
          this.url = 'data:image/png;base64,' + this.client.client_picture;
        }
        console.log(this.url);
        this.campId = this.client.current_camp_id;

        this.service.getClientDwellings(this.clientId).subscribe((data: ClientDwelling[]) => {
          if (data.length === 0) {
            alert(
              "Please ask this client 1) If this is first time homeless? 2) Why they are homeless? and 3) When they became homeless? Please record this under a new 'Dwelling History' entry."
            );
          }
        })

        this.service.getClientHousehold(this.client.household_id).subscribe(
          (data: Client[]) => {
            this.householdClients = data;
          },
          (error) => console.log(error)
        );
      });
      if (this.routeInstanceId != null) {
        this.service.getClientNotesForRoute(this.clientId, this.routeInstanceId).subscribe((data: Note[]) => {
          this.notes = data;
          this.notes.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);
          this.goToTop();
        }, (error) => console.log(error));
      }

      if (this.isAdmin) {
        this.service.getClientNotesForClient(this.clientId).subscribe(
          (data: Note[]) => {
            this.notes = data;
            console.log(JSON.stringify(data));
            let pinnedNotes: Note[] = data.filter(n => n.source == "PINNED NOTE");
            console.log(JSON.stringify(pinnedNotes))
            pinnedNotes.forEach(n => {
              if (this.pinnedNoteString === "") {
                this.pinnedNoteString = n.note;
              } else {
                this.pinnedNoteString += '\r\n' + n.note;
              }
              console.log(this.pinnedNoteString);
            });

            this.notes.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);
            let warningNotes: Note[] = data.filter(n => n.source === "WARNING");
            if (warningNotes.length > 0) {
              alert(warningNotes[warningNotes.length - 1].note);
            }
          },
          (error) => console.log(error)
        );
        this.service.getRecentReceivedItems(this.clientId).subscribe(
          (data: RequestedItem[]) => {
            this.receivedItems = data;
          },
          (error) => console.log(error)
        );
        this.service.getRequestedItems(this.clientId).subscribe(
          (data: RequestedItem[]) => {
            this.requestedItems = data.filter((w) => w.has_received != true);
          },
          (error) => console.log(error)
        );
        this.service.getClientPets(this.clientId).subscribe(
          (data: ClientPet[]) => {
            this.pets = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientCircleOfFriends(this.clientId).subscribe(
          (data: ClientCircleOfFriends[]) => {
            this.circleOfFriends = data;
          },
          (error) => console.log(error)
        );
        this.service.getTentsForClient(this.clientId).subscribe(
          (data: Tent[]) => {
            this.tents = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientDwellings(this.clientId).subscribe(
          (data: ClientDwelling[]) => {
            this.dwellings = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientReferrals(this.clientId).subscribe(
          (data: ReferralsResources[]) => {
            this.referralsResources = data;
          },
          (error) => console.log(error)
        );
        this.service.getGoalsAndNextSteps(this.clientId).subscribe(
          (data: GoalsNextStep[]) => {
            this.goalsAndSteps = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientLikes(this.clientId).subscribe(
          (data: ClientLike[]) => {
            this.clientLikes = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientDislikes(this.clientId).subscribe(
          (data: ClientDislike[]) => {
            this.clientDislikes = data;
          },
          (error) => console.log(error)
        );
        this.service.getHealthConcerns(this.clientId).subscribe(
          (data: HealthConcern[]) => {
            this.healthConcerns = data;
          },
          (error) => console.log(error)
        );
        this.service.getHeatersForClient(this.clientId).subscribe(
          (data: Heater[]) => {
            this.heaters = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientPrayerRequests(this.clientId).subscribe(
          (data: PrayerRequestAndNeed[]) => {
            this.prayerRequestsAndNeeds = data;
          },
          (error) => console.log(error)
        );
        this.service.getClientLoanedTanks(this.clientId).subscribe((tankInteractions: any[]) => {
          // now get the tank info
          this.tankInteractions = tankInteractions;
        });
        this.service.getClientLoanedHoses(this.clientId).subscribe((hoseInteractions: any[]) => {
          // now get the Hose info
          this.hoseInteractions = hoseInteractions;
        });
        this.service.getHeatEquipmentNotReturned(this.clientId).subscribe(
          (data: any[]) => {
            this.heatEquipmentNotReturned = data;
          },
          (error) => console.log(error)
        );
        this.getHeaterStatuses();
        this.mainService
          .getClientAttendanceHistory(
            this.clientId,
            this.pipe.transform(this.attendanceFromDate, "yyyy-MM-dd"),
            this.pipe.transform(this.attendanceToDate, "yyyy-MM-dd")
          )
          .subscribe(
            (data: any[]) => {
              this.clientInteractions = data;
              this.clientInteractions.sort(function (a, b) {
                return (
                  new Date(b.serviced_date).valueOf() -
                  new Date(a.serviced_date).valueOf()
                );
              });
              this.goToTop();
            },
            (error) => console.log(error)
          );
      } else {
        this.service.getClientNotesForClient(this.clientId).subscribe(
          (data: Note[]) => {
            let pinnedNotes: Note[] = data.filter(n => n.source === "PINNED NOTE");
            pinnedNotes.forEach(n => {
              if (this.pinnedNoteString === '') {
                this.pinnedNoteString = n.note;
              } else {
                this.pinnedNoteString += '\r\n' + n.note;
              }
              console.log(this.pinnedNoteString);
            });
            let warningNotes: Note[] = data.filter(n => n.source === "WARNING");
            if (warningNotes.length > 0) {
              alert(warningNotes[warningNotes.length - 1].note);
            }
          },
          (error) => console.log(error)
        );
      }

      if (this.heatRoute) {
        // get heating equipment for this person
        this.service
          .getHeatersForClient(this.clientId)
          .subscribe((data: Heater[]) => {
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
        this.service
          .getHeatEquipmentNotReturned(this.clientId)
          .subscribe((data: any[]) => {
            this.heatEquipmentNotReturned = data;
            this.goToTop();
            let difference = new Date().getTime() - new Date(this.client.created_at).getTime();
            difference = difference / (1000 * 3600 * 24)
            if (difference < 14) {
              alert('Please ask if the client has any pets and get the type (dog or cat), name, breed, age, and if they want monthly pet food in the Pets section.');
            }
          });
        this.getHeaterStatuses();
      } else {
        this.service
          .getRecentReceivedItems(this.clientId)
          .subscribe((data: RequestedItem[]) => {
            this.receivedItems = data;
          });
        this.service
          .getRequestedItems(this.clientId)
          .subscribe((data: RequestedItem[]) => {
            this.requestedItems = data.filter((w) => w.has_received != true);
          });
        this.service
          .getClientPets(this.clientId)
          .subscribe((data: ClientPet[]) => {
            this.pets = data;
          });
        this.service
          .getClientCircleOfFriends(this.clientId)
          .subscribe((data: ClientCircleOfFriends[]) => {
            this.circleOfFriends = data;
          });
        this.service
          .getTentsForClient(this.clientId)
          .subscribe((data: Tent[]) => {
            this.tents = data;
          });
        this.service
          .getClientDwellings(this.clientId)
          .subscribe((data: ClientDwelling[]) => {
            this.dwellings = data;
          });
        this.service
          .getClientReferrals(this.clientId)
          .subscribe((data: ReferralsResources[]) => {
            this.referralsResources = data;
          });
        this.service
          .getGoalsAndNextSteps(this.clientId)
          .subscribe((data: GoalsNextStep[]) => {
            this.goalsAndSteps = data;
          });
        this.service
          .getClientLikes(this.clientId)
          .subscribe((data: ClientLike[]) => {
            this.clientLikes = data;
          });
        this.service
          .getClientDislikes(this.clientId)
          .subscribe((data: ClientDislike[]) => {
            this.clientDislikes = data;
          });
        this.service
          .getHealthConcerns(this.clientId)
          .subscribe((data: HealthConcern[]) => {
            this.healthConcerns = data;
            this.goToTop();
            let difference = new Date().getTime() - new Date(this.client.created_at).getTime();
            difference = difference / (1000 * 3600 * 24)
            if (difference < 14) {
              alert('Please ask if the client has any pets and get the type (dog or cat), name, breed, age, and if they want monthly pet food in the Pets section.');
            }
          });
      }
    } else {
      this.router.navigate(["/routes"]);
    }
  }

  searchWeeklyAttendance() {
    this.mainService
      .getClientAttendanceHistory(
        this.clientId,
        this.pipe.transform(this.attendanceFromDate, "yyyy-MM-dd"),
        this.pipe.transform(this.attendanceToDate, "yyyy-MM-dd")
      )
      .subscribe(
        (data: any[]) => {
          this.clientInteractions = data;
          this.clientInteractions.sort(function (a, b) {
            return (
              new Date(b.serviced_date).valueOf() -
              new Date(a.serviced_date).valueOf()
            );
          });
        },
        (error) => console.log(error)
      );
  }

  ngOnDestroy() {
    if (this.updateTimerSubscription) {
      this.updateHoseTankMessageVisible = false;
      this.updateTimerSubscription.unsubscribe();
    }
  }

  getHeaterStatuses(): void {
    this.mainService.getHeaterStatuses().subscribe(
      (heaterStatuses) => {
        this.heaterStatuses = heaterStatuses.filter(
          (w: { id: number }) => w.id !== 1
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loaningHeater(heaterId: any) {
    this.updateHeaterEntry(heaterId, 2);
  }

  heaterStatusChanged(status_id: number) {
    this.currentStatus = status_id;
  }

  updateHeaterEntry(heaterId: number, statusId: number) {
    this.service
      .updateHeaterClient(this.client.id, heaterId, statusId)
      .subscribe((response) => {
        this.service.getHeatersForClient(this.client.id).subscribe(
          (data: any[]) => {
            this.heaters = data;
          },
          (error) => console.log(error)
        );
        this.service
          .getHeatEquipmentNotReturned(this.clientId)
          .subscribe((data1: any[]) => {
            this.heatEquipmentNotReturned = data1;
          });
      });
  }

  updateNumberTanksHoses(client: Client) {
    this.service.updateClient(client).subscribe(
      (data) => {
        let updateTimer = timer(2000, 2000);
        this.updateTimerSubscription = updateTimer.subscribe((data) => {
          this.hideConfirmationMessage();
        });
        this.updateHoseTankMessageVisible = true;
      },
      (error) => console.log(error)
    );
  }

  updateNeedPetFood(pet: ClientPet) {
    pet.food_requested = !pet.food_requested;
    this.service.updatePet(pet).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  updatePetInfo(pet: ClientPet) {
    this.service.updatePet(pet).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  updateClientCircleOfFriends(friend: ClientCircleOfFriends) {
    this.service.updateCircleOfFriends(friend).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  hideConfirmationMessage(): any {
    this.updateHoseTankMessageVisible = false;
    this.updateTimerSubscription.unsubscribe();
  }

  sendInteraction(interactionType: number) {
    const interaction: Appearance = new Appearance();
    interaction.client_id = this.client.id;
    interaction.location_camp_id = this.locationCampId ? this.locationCampId : this.client.current_camp_id;
    if (interactionType === 1) {
      interaction.serviced = true;
      interaction.was_seen = true;
      interaction.still_lives_here = true;
      interaction.at_homeless_resource_center = false;
    } else if (interactionType === 2) {
      interaction.serviced = true;
      interaction.still_lives_here = true;
      interaction.was_seen = false;
      interaction.at_homeless_resource_center = false;
    } else if (interactionType === 3) {
      interaction.serviced = false;
      interaction.still_lives_here = false;
      interaction.was_seen = false;
      interaction.at_homeless_resource_center = false;
    } else if (interactionType === 4) {
      interaction.serviced = false;
      interaction.still_lives_here = true;
      interaction.was_seen = false;
      interaction.at_homeless_resource_center = false;
    } else if (interactionType === 5) {
      interaction.serviced = true;
      interaction.was_seen = true;
      interaction.still_lives_here = true;
      interaction.at_homeless_resource_center = true;
      // if neither locationCampId nor current_camp_id have a value, set it to HRC camp
      if (!interaction.location_camp_id || interaction.location_camp_id == 0) {
        interaction.location_camp_id = 449;
        this.client.current_camp_id = 449;
      }
    }

    if (this.isAdmin) {
      if (interaction.location_camp_id == 0) {
        interaction.location_camp_id = 449;
      }

      // Allow them to select a Date
      const modalRef: NgbModalRef = this.modalService.open(
        DateSelectorComponent,
        {
          size: "lg",
          backdrop: "static",
        }
      );
      modalRef.result.then((selected_date: Date) => {
        if (!selected_date) {
          return;
        } else {
          interaction.serviced_date = selected_date;
          if (interaction.serviced) {
            if (
              interaction.serviced_date.valueOf() >
              new Date(this.client.last_interaction_date).valueOf()
            ) {
              this.client.last_interaction_date = interaction.serviced_date;
            }

            this.createUpdateInteraction(interaction);
          } else if (!interaction.still_lives_here) {
            this.client.previous_camp_id = interaction.location_camp_id;
            this.client.current_camp_id = null;

            this.createUpdateInteraction(interaction);
          } else {
            this.createUpdateInteraction(interaction);
          }
        }
      });
    } else {
      interaction.serviced_date = new Date();
      if (interaction.serviced) {
        this.client.last_interaction_date = new Date();
        this.createUpdateInteraction(interaction);
      } else if (!interaction.still_lives_here) {
        this.client.previous_camp_id = interaction.location_camp_id;
        this.client.current_camp_id = null;

        this.createUpdateInteraction(interaction);
      } else {
        this.createUpdateInteraction(interaction);
      }
    }

    console.log("camp id: " + interaction.location_camp_id);
  }

  private createUpdateInteraction(interaction: Appearance) {
    let routeAttendanceList: Appearance[] = JSON.parse(
      window.localStorage.getItem("RouteAttendance")
    );
    let appearance: Appearance = routeAttendanceList.find(
      (x) => x.client_id == interaction.client_id
    );

    console.log(this.client.status);
    if (interaction.serviced && this.client.status === "Inactive") {
      this.client.status = "Active";
    }

    if (appearance) {
      interaction.id = appearance.id;

      this.service.updateClientAppearance(interaction).subscribe(
        (data) => {
          routeAttendanceList[routeAttendanceList.indexOf(appearance)] = interaction;

          if (!interaction.still_lives_here) {
            alert('Please add a new dwelling to indicate where they went and any other applicable notes');
            document.getElementById("newDwellingButton").click();
          }

          let dwellingDates = this.dwellings.map(dwelling => dwelling.created_at);
          let clientDwelling : ClientDwelling = this.dwellings.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0];

          console.log(JSON.stringify(clientDwelling));
          var difference = new Date().getTime() - new Date(clientDwelling.created_at).getTime();
          difference = Math.ceil(difference / (1000 * 3600 * 24));
          console.log('Difference: ' + difference)
          if (interaction.serviced && (clientDwelling.dwelling == "House" || clientDwelling.dwelling == "Apartment" || clientDwelling.dwelling == "Shelter" || clientDwelling.dwelling == "Motel" || clientDwelling.dwelling == "Motel") && difference > 90) {
            clientDwelling.first_time_homeless = false;
            this.service.updateClientDwelling(clientDwelling).subscribe(data => {
              console.log(data);
            }, error => console.log(error));
          }

          this.updateClientAndListing(routeAttendanceList);
        },
        (error) => console.log(error)
      );
    } else {
      console.log(`Appearance to add: ${JSON.stringify(interaction)}`);
      this.service.insertClientAppearance(interaction).subscribe(
        (data) => {
          interaction.id = data.id;
          routeAttendanceList.push(interaction);
          this.clientInteractions.push(data);

          if (!interaction.still_lives_here) {
            alert('Please add a new dwelling to indicate where they went and any other applicable notes');
            document.getElementById("newDwellingButton").click();
          }

          let dwellingDates = this.dwellings.map(dwelling => dwelling.created_at);
          let clientDwelling : ClientDwelling = this.dwellings.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0];
          console.log(JSON.stringify(clientDwelling));
          
          var difference = new Date().getTime() - new Date(clientDwelling.created_at).getTime();
          difference = Math.ceil(difference / (1000 * 3600 * 24));
          console.log('Difference: ' + difference)
          if (interaction.serviced && (clientDwelling.dwelling == "House" || clientDwelling.dwelling == "Apartment" || clientDwelling.dwelling == "Shelter" || clientDwelling.dwelling == "Motel" || clientDwelling.dwelling == "Camper") && difference > 90) {
            clientDwelling.first_time_homeless = false;
            this.service.updateClientDwelling(clientDwelling).subscribe(data => {
              console.log(data);
            }, error => console.log(error));
          }

          this.updateClientAndListing(routeAttendanceList);
        },
        (error) => console.log(error)
      );
    }
  }

  private updateClientAndListing(routeAttendanceList: Appearance[]) {
    this.service.updateClient(this.client).subscribe(
      (data) => {
        console.log(data.status);
        if (!this.isAdmin) {
          window.localStorage.setItem(
            "RouteAttendance",
            JSON.stringify(routeAttendanceList)
          );
          console.log(
            "Number of interactions in route attendance list: " +
            routeAttendanceList.length
          );
          console.log(JSON.stringify(routeAttendanceList));
          this.router.navigate([`/locationCamp/${this.locationCampId}`]);
        }
      },
      (error) => console.log(error)
    );
  }

  requestedItemAdded(items: RequestedItem[]) {
    items.forEach(i => {
      this.requestedItems.push(i);
      const element = document.querySelector("#items");
      element.scrollIntoView();
    });
  }

  likeAdded(like: ClientLike) {
    this.clientLikes.push(like);
    const element = document.querySelector("#likes");
    element.scrollIntoView();
  }

  tentAdded(tent: Tent) {
    this.tents.push(tent);
    const element = document.querySelector("#tents");
    element.scrollIntoView();
  }

  clientDwellingAdded(dwelling: ClientDwelling) {
    this.dwellings.push(dwelling);
    const element = document.querySelector("#dwellings");
    element.scrollIntoView();
  }

  referralResourceAdded(referralResource: ReferralsResources) {
    this.referralsResources.push(referralResource);
    const element = document.querySelector("#referralsResources");
    element.scrollIntoView();
  }

  dislikeAdded(dislike: ClientDislike) {
    this.clientDislikes.push(dislike);
    const element = document.querySelector("#dislikes");
    element.scrollIntoView();
  }

  editedClient(theClient: Client) {
    this.client = theClient;
    if (this.client.client_picture != null && this.client.client_picture != '') {
      this.url = 'data:image/png;base64,' + this.client.client_picture;
    }
  }

  healthConcernAdded(concern: HealthConcern) {
    this.healthConcerns.push(concern);
    const element = document.querySelector("#concerns");
    element.scrollIntoView();
  }

  goalAdded(goal: GoalsNextStep) {
    this.goalsAndSteps.push(goal);
    const element = document.querySelector("#goals");
    element.scrollIntoView();
  }

  prayerRequestNeedAdded(request: PrayerRequestAndNeed) {
    this.prayerRequestsAndNeeds.push(request);
    const element = document.querySelector("#prayerRequestsNeeds");
    element.scrollIntoView();
  }

  noteAdded(note: Note) {
    this.notes.push(note);
    if (note.source === "PINNED NOTE") {
      if (this.pinnedNoteString === "") {
        this.pinnedNoteString = note.note;
      } else {
        this.pinnedNoteString += '\r\n' + note.note;
      }
    }
    const element = document.querySelector("#notes");
    element.scrollIntoView();
  }

  petAdded(pet: ClientPet) {
    this.pets.push(pet);
    const element = document.querySelector("#petList");
    element.scrollIntoView();
  }

  friendAdded(friend: ClientCircleOfFriends) {
    this.circleOfFriends.push(friend);
    const element = document.querySelector("#circle-of-friends");
    element.scrollIntoView();
  }

  clientSelected(client: Client) {
    this.householdClients.push(client);

    client.household_id = this.client.household_id;
    this.service.updateClient(client).subscribe(
      (data) => { },
      (error) => console.log(error)
    );
  }

  dateSelected(date_seen: Date) { }

  goToTop() {
    const element = document.querySelector("#topOfScreen");
    element.scrollIntoView();
  }

  backToClientListing() {
    this.router.navigate(["/admin/clientListing"]);
  }

  viewClient(theClient) {
    localStorage.setItem('selectedClient', JSON.stringify(theClient.id));
    this.router.navigate(['/serviceClient']);
    window.location.reload();
  }

  backToCamp() {
    let title: string = "Confirm Action";
    let confirmText: string = "Yes";
    let dismissText: string = "No";
    let message: string;

    if (this.isAdmin) {
      this.router.navigate([`/locationCamp/${this.campId}`]);
    } else {
      if (!this.sentInteraction) {
        message =
          "Are you sure you want to close out of this client? You have not yet marked them as seen or serviced.";
        const dialogData = new ConfirmDialogModel(
          title,
          message,
          confirmText,
          dismissText
        );
        const dialogRef = this.dialog.open(CustomConfirmationDialogComponent, {
          data: dialogData,
          maxWidth: "400px",
        });

        dialogRef.afterClosed().subscribe((result) => {
          let canContinue: boolean = JSON.parse(result);

          if (!canContinue) {
            return;
          }

          this.router.navigate([`/locationCamp/${this.locationCampId}`]);
        });
      } else {
        this.router.navigate([`/locationCamp/${this.locationCampId}`]);
      }
    }
  }

  deleteRequest(id: number) {
    this.service.deletedRequestedItem(id).subscribe((res) => {
      this.requestedItems = this.requestedItems.filter((w) => w.id != id);
    });
  }

  removeLike(id: number) {
    this.service.removeLike(id).subscribe((res) => {
      this.clientLikes = this.clientLikes.filter((w) => w.id != id);
    });
  }

  removeClientFriend(id: number) {
    this.service.removeClientFriend(id).subscribe((res) => {
      this.circleOfFriends = this.circleOfFriends.filter((w) => w.id != id);
    })
  }

  removeDislike(id: number) {
    this.service.removeDislike(id).subscribe((res) => {
      this.clientDislikes = this.clientDislikes.filter((w) => w.id != id);
    });
  }

  removeReferralResource(id: number) {
    this.service.removeReferralResource(id).subscribe((res) => {
      this.referralsResources = this.referralsResources.filter(
        (w) => w.id != id
      );
    });
  }

  removeReceivedItem(id: number) {
    this.service.deletedRequestedItem(id).subscribe((res) => {
      this.receivedItems = this.receivedItems.filter((w) => w.id != id);
    });
  }

  removeTent(id: number) {
    this.service.removeTent(id).subscribe((res) => {
      this.tents = this.tents.filter((w) => w.id != id);
    });
  }

  removeClientDwelling(id: number) {
    this.service.removeClientDwelling(id).subscribe((res) => {
      this.dwellings = this.dwellings.filter((w) => w.id != id);
    });
  }

  removeGoal(id: number) {
    this.service.deleteGoalAndNextStep(id).subscribe((res) => {
      this.goalsAndSteps = this.goalsAndSteps.filter((w) => w.id != id);
    });
  }

  removePet(id: number) {
    this.service.removePet(id).subscribe((res) => {
      this.pets = this.pets.filter((w) => w.id != id);
    });
  }

  removeAppearance(id: number) {
    if (confirm("Are you sure you want to remove this appearance?")) {
      this.service.removeAppearance(id).subscribe((res) => {
        this.clientInteractions = this.clientInteractions.filter(
          (w) => w.id != id
        );
      });
    }
  }

  removeHealthConcern(id: number) {
    this.service.removeHealthConcern(id).subscribe((res) => {
      this.healthConcerns = this.healthConcerns.filter((w) => w.id != id);
    });
  }

  removeNote(id: number) {
    this.service.removeNote(id).subscribe((res) => {
      this.notes = this.notes.filter((w) => w.id != id);
      this.pinnedNoteString = '';
      let pinnedNotes: Note[] = this.notes.filter(n => n.source === "PINNED NOTE");
            pinnedNotes.forEach(n => {
              if (this.pinnedNoteString === '') {
                this.pinnedNoteString = n.note;
              } else {
                this.pinnedNoteString += '\r\n' + n.note;
              }
              console.log(this.pinnedNoteString);
            });
    });
  }

  removePrayerRequestNeed(id: number) {
    this.service.removePrayerRequestNeed(id).subscribe((res) => {
      this.prayerRequestsAndNeeds = this.prayerRequestsAndNeeds.filter(
        (w) => w.id != id
      );
    });
  }

  removeHouseholdClient(client: Client) {
    client.household_id = client.id;

    if (this.client.id == client.household_id) {
      this.client.household_id = client.id;
    }

    this.service.updateClient(client).subscribe((data) => {
      this.service
        .getClientHousehold(this.clientId)
        .subscribe((data: Client[]) => {
          this.householdClients = data;
        });
    });
  }

  completedGoal(goal: GoalsNextStep) {
    goal.is_completed = true;
    this.service.completeGoalAndNextStep(goal).subscribe((response) => {
      this.goalsAndSteps = this.goalsAndSteps.filter((w) => w.id != goal.id);
    });
  }

  receivedRequest(id: number) {
    this.service.receivedRequestedItem(id).subscribe((response) => {
      this.requestedItems = this.requestedItems.filter((w) => w.id != id);
      this.service
        .getRecentReceivedItems(this.client.id)
        .subscribe((data: RequestedItem[]) => {
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

      this.mainService.insertHeater(newHeater).subscribe(
        (response: Heater) => {
          this.updateHeaterEntry(response.id, 2);
          this.getHeaterStatuses();
        },
        (error) => console.log(error)
      );
    }
  }

  loanTank() {
    if (this.clientId != null) {
      this.service.loanTank(this.clientId).subscribe((response) => {
        this.service
          .getClientLoanedTanks(this.clientId)
          .subscribe((data: any) => {
            this.tankInteractions = data;
          });
      });
    }
  }

  loanHose(): void {
    if (this.clientId != null) {
      this.service.loanHose(this.clientId).subscribe((response) => {
        this.service
          .getClientLoanedHoses(this.clientId)
          .subscribe((data: any) => {
            this.hoseInteractions = data;
          });
      });
    }
  }

  submitTankStatus(interactionId: number, statusId: number): void {
    if (statusId != 2) {
      this.service
        .updateTankInteraction(interactionId, statusId)
        .subscribe((data) => {
          this.service
            .getClientLoanedTanks(this.clientId)
            .subscribe((response: any[]) => {
              this.tankInteractions = response;
            });
          this.service
            .getHeatEquipmentNotReturned(this.clientId)
            .subscribe((data1: any[]) => {
              this.heatEquipmentNotReturned = data1;
            });
        });
    }
  }

  submitHoseStatus(interactionId: any, statusId: number): void {
    if (statusId != 2) {
      this.service
        .updateHoseInteraction(interactionId, statusId)
        .subscribe((data) => {
          this.service
            .getClientLoanedHoses(this.clientId)
            .subscribe((response: any[]) => {
              this.hoseInteractions = response;
            });
          this.service
            .getHeatEquipmentNotReturned(this.clientId)
            .subscribe((data1: any[]) => {
              this.heatEquipmentNotReturned = data1;
            });
        });
    }
  }

  submitHeaterStatus(interactionId: any, statusId: number) {
    if (statusId != 2) {
      this.service
        .updateHeaterInteraction(interactionId, statusId)
        .subscribe((data) => {
          this.service
            .getHeatersForClient(this.clientId)
            .subscribe((response: any[]) => {
              this.heaters = response;
            });
          this.service.getHeatEquipmentNotReturned(this.clientId).subscribe((data1: any[]) => {
            this.heatEquipmentNotReturned = data1;
          });
        });
    }
  }

  onHouseholdRelationshipTypeChange(householdClient: Client) {
    this.service.updateClient(householdClient).subscribe((data) => {
      // household client was updated
      // testing out if push from UI will fix CORS
    },
      (error) => console.log(error)
    );
  }

  onNoteTypeChange(note: Note) {
    this.service.updateClientNote(note).subscribe((data) => {
      this.pinnedNoteString = '';
      let pinnedNotes: Note[] = this.notes.filter(n => n.source === "PINNED NOTE");
            pinnedNotes.forEach(n => {
              if (this.pinnedNoteString === '') {
                this.pinnedNoteString = n.note;
              } else {
                this.pinnedNoteString += '\r\n' + n.note;
              }
              console.log(this.pinnedNoteString);
            });
    },
      (error) => console.log(error)
    );
  }
}
