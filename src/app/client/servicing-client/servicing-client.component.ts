import { formatPhoneNumberValue } from 'app/utils/phone-utils';
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
import { ClientBarrier } from 'app/models/client-barrier';
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
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { Subscription, timer } from "rxjs";
import { DatePipe } from "@angular/common";
import { PrayerRequestAndNeed } from "app/models/prayer-request";
import {
  ConfirmDialogModel,
  CustomConfirmationDialogComponent,
} from "app/custom-confirmation-dialog/custom-confirmation-dialog.component";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DateSelectorComponent } from "app/insert-modals/date-selector/date-selector.component";
import { ClientIncome } from "app/models/client-income";
import { ClientNextOfKin } from "app/models/client-next-of-kin";
import { ClientHomelessHistory } from "app/models/client-homeless-histories";
import { NextOfKinComponent } from "app/insert-modals/next-of-kin/next-of-kin.component";
import { LocationCamp } from "app/models/location-camp";
import { Route } from "app/models/route";
import { ClientHealthInsurance } from "app/models/client-health-insurance";
import { ClientStep } from "app/models/client-step";
import { ClientPastEviction } from "app/models/client-past-eviction";
import { ClientFelony } from "app/models/client-felony";
import { ClientDebt } from "app/models/client-debt";
import { ClientSkill } from "app/models/client-skill";
import { Caseworker } from "app/models/caseworker";
import { ClientMailbox } from 'app/models/client-mailbox';
import { AuthorizedMailAccesses } from 'app/models/authorized-mail-accesses';

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
  clientIncomes: ClientIncome[] = [];
  clientNextOfKins: ClientNextOfKin[] = [];
  clientDislikes: ClientDislike[] = [];
  clientBarriers: ClientBarrier[] = [];
  healthConcerns: HealthConcern[] = [];
  prayerRequestsAndNeeds: PrayerRequestAndNeed[] = [];
  householdClients: Client[] = [];
  healthInsurances: ClientHealthInsurance[] = [];
  clientSkills: ClientSkill[] = [];
  notes: Note[] = [];
  routeName: string = '';
  clientPastEvictions: ClientPastEviction[] = [];
  clientFelonies: ClientFelony[] = [];
  clientDebts: ClientDebt[] = [];
  clientMailbox: ClientMailbox = new ClientMailbox();
  authorizedMailAccesses: AuthorizedMailAccesses[] = [];
  pets: ClientPet[] = [];
  tents: Tent[] = [];
  steps: ClientStep[] = [];
  dwellings: ClientDwelling[] = [];
  homelessHistories: ClientHomelessHistory[] = [];
  circleOfFriends: ClientCircleOfFriends[] = [];
  referralsResources: ReferralsResources[] = [];
  sentInteraction = false;
  receivedItems: RequestedItem[] = [];
  filteredReceivedItems: RequestedItem[] = [];
  heatRoute = false;
  tankInteractions: any[] = [];
  hoseInteractions: any[] = [];
  heatEquipmentNotReturned: any[] = [];
  clientId = null;
  clientCaseworkers: Caseworker[] = [];
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
  mapIcon = faMap;
  routeInstanceId: number;
  pinnedNoteString: string = '';
  pipe: DatePipe = new DatePipe("en-us");
  reasonForHomelessnessOptions = [
    "Addictions",
    "Domestic Violence",
    "Eviction",
    "Family Conflict",
    "Family Dispute",
    "Family Loss",
    "Financial Hardship",
    "Health Issues",
    "Job Loss",
    "Legal Issues",
    "Medical Issues",
    "Mental Health",
    "Natural Disaster",
    "Prison/Jail",
    "Release from Hospital",
    "Release from Jail",
    "Release from Treatment",
    "Substance Abuse",
    "Unknown",
    "Other"
  ];
  stepOptions = [
    'Apply for a birth certificate',
    'Apply for a half-price of bus pass',
    'Apply for disability or social security benefits',
    'Apply for Dress for Success or Men on the Move program',
    'Apply for food stamps',
    'Apply for healthcare benefits',
    'Apply for housing or an apartment',
    'Apply for job',
    'Apply for social security card',
    'Buy a cell phone',
    'Complete Intake with PHC',
    'Contact a landlord or apartment complex',
    'Create a gratitude journal',
    'Find a church family',
    'Find weekly activities you enjoy, such as bingo, community events, etc.',
    'Get a library card',
    'Get job training, such as St. Vincent De Paul Back2Work program',
    'Learn to use a computer',
    'Prepare for a job, such as clothing, haircut, boots, etc.',
    'Schedule a doctor’s appointment',
    'Schedule DOT appointment to get a driver’s license or ID',
    'Search for housing',
    'Search for jobs',
    'Seek help from a counselor, therapist, or mental health professional',
    'Set goals',
    'Set up a budget',
    'Set up a personal email',
    'Set up your cell phone'
  ];
  organizations: string[] = [
    'Anawim',
    'Aging Resources',
    'Broadlawns',
    'Community Support Advocate',
    'DHS',
    'Eyerly Ball',
    'Iowa Total Care',
    'Molina',
    'Primary Health Care',
    'Wellshare',
    'Wellpoint',
    'YMCA Supportive Housing',
    'Other'
  ];

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
      localStorage.getItem("RouteAttendance") || '[]'
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

        this.mainService.getLocationCamp(this.campId).subscribe((camp: LocationCamp) => {
          let route_id = camp.route_id;
          this.mainService.getRouteById(route_id).subscribe((route: Route) => {
            this.routeName = route.name;
          }, error => console.log(error));
        }, (error) => console.log(error));

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

        this.service.getClientCaseworkers(this.clientId).subscribe((data: Caseworker[]) => {
          this.clientCaseworkers = data;
        }, (error) => console.log(error));

        this.service.getMailboxForClient(this.clientId).subscribe((data: ClientMailbox) => {
          this.clientMailbox = data;

          if (this.clientMailbox != null) {
            console.log('Client Mailbox:', JSON.stringify(this.clientMailbox));
            this.service.getAuthorizedMailAccessors(this.clientMailbox.id).subscribe((data: AuthorizedMailAccesses[]) => {
              console.log('Authorized Mail Accessors:', JSON.stringify(data));
              this.authorizedMailAccesses = data;
            }, error => console.log(error));
          }
        }, error => console.log(error));
      }, (error) => console.log(error));

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
            let pinnedNotes: Note[] = data.filter(n => n.source == "PINNED NOTE");
            pinnedNotes.forEach(n => {
              if (this.pinnedNoteString === "") {
                this.pinnedNoteString = n.note;
              } else {
                this.pinnedNoteString += '\r\n' + n.note;
              }
            });

            this.notes.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);
            let warningNotes: Note[] = data.filter(n => n.source === "WARNING");
            if (warningNotes.length > 0) {
              alert(warningNotes[warningNotes.length - 1].note);
            }
          },
          (error) => console.log(error)
        );

        this.service.getClientHealthInsurance(this.clientId).subscribe({
          next: (data: ClientHealthInsurance[]) => {
            this.healthInsurances = data;
          },
          error: (error) => console.log(error)
        });

        this.service.getClientSteps(this.clientId).subscribe({
          next: (data: ClientStep[]) => {
            this.steps = data;
          },
          error: (error) => console.log(error)
        });

        this.service.getClientDebt(this.clientId).subscribe({
          next: (data: ClientDebt[]) => {
            this.clientDebts = data;
          },
          error: (error) => console.log(error)
        });

        this.service.getClientFelonies(this.clientId).subscribe({
          next: (data: ClientFelony[]) => {
            this.clientFelonies = data;
          },
          error: (error) => console.log(error)
        });

        this.service.getPastEvictions(this.clientId).subscribe({
          next: (data: ClientPastEviction[]) => {
            this.clientPastEvictions = data;
          },
          error: (error) => console.log(error)
        });

        this.service.getClientSkills(this.clientId).subscribe({
          next: (data: ClientSkill[]) => {
            this.clientSkills = data;
          },
          error: (error) => console.log(error)
        });

        this.service.getRecentReceivedItems(this.clientId).subscribe(
          (data: RequestedItem[]) => {
            this.receivedItems = data;
            this.filteredReceivedItems = this.receivedItems.slice(0, 10);
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
        this.service.getClientHomelessHistory(this.clientId).subscribe(
          (data: ClientHomelessHistory[]) => {
            this.homelessHistories = data;
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
        this.service.getClientBarriers(this.clientId).subscribe({
          next: (data: ClientBarrier[]) => {
            this.clientBarriers = data;
          },
          error: (error) => console.log(error)
        });
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

        this.mainService.getClientAttendanceHistory(this.clientId, this.pipe.transform(this.attendanceFromDate, "yyyy-MM-dd"), this.pipe.transform(this.attendanceToDate, "yyyy-MM-dd")).subscribe((data: any[]) => {
          this.clientInteractions = data;
          this.clientInteractions.sort(function (a, b) {
            return (
              new Date(b.serviced_date).valueOf() -
              new Date(a.serviced_date).valueOf()
            );
          });

          this.goToTop();
        }, (error) => console.log(error));
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
            });
            let warningNotes: Note[] = data.filter(n => n.source === "WARNING");
            if (warningNotes.length > 0) {
              alert(warningNotes[warningNotes.length - 1].note);
            }
          },
          (error) => console.log(error)
        );

        this.mainService.getClientAttendanceHistory(this.clientId, this.pipe.transform(this.attendanceFromDate, "yyyy-MM-dd"), this.pipe.transform(this.attendanceToDate, "yyyy-MM-dd")).subscribe((data: any[]) => {
          this.clientInteractions = data;
          this.clientInteractions.sort(function (a, b) {
            return (
              new Date(b.serviced_date).valueOf() -
              new Date(a.serviced_date).valueOf()
            );
          });

          const now = new Date();
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);

          this.clientInteractions = this.clientInteractions.filter(ci => new Date(ci.serviced_date) > new Date(oneMonthAgo) && !ci.at_homeless_resource_center)

          this.goToTop();
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
            if (!this.isAdmin) {
              let difference = new Date().getTime() - new Date(this.client.created_at).getTime();
              difference = difference / (1000 * 3600 * 24)
              if (difference < 7) {
                alert('Please ask if the client has any pets and get the type (dog or cat), name, breed, age, and if they want monthly pet food in the Pets section.');
              }
            }
          });
        this.getHeaterStatuses();
      }

      this.service.getRecentReceivedItems(this.clientId).subscribe((data: RequestedItem[]) => {
        this.receivedItems = data;
        this.filteredReceivedItems = this.receivedItems.slice(0, 10);
      });
      this.service.getRequestedItems(this.clientId).subscribe((data: RequestedItem[]) => {
        this.requestedItems = data.filter((w) => w.has_received != true);
      });
      this.service
        .getClientPets(this.clientId)
        .subscribe((data: ClientPet[]) => {
          this.pets = data;
        });
      this.service.getClientIncomes(this.clientId).subscribe((data: ClientIncome[]) => {
        this.clientIncomes = data;
      }, error => console.log(error));
      this.service.getClientNextOfKins(this.clientId).subscribe((data: ClientNextOfKin[]) => {
        this.clientNextOfKins = data;
      }, error => console.log(error));
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

          if (!this.isAdmin) {
            let difference = new Date().getTime() - new Date(this.client.created_at).getTime();
            difference = difference / (1000 * 3600 * 24)
            if (difference < 7) {
              alert('Please ask if the client has any pets and get the type (dog or cat), name, breed, age, and if they want monthly pet food in the Pets section.');
            }
          }
        });
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

  showMap() {
    if (this.client.latitude !== null && this.client.longitude !== null) {
      window.open(`https://www.google.com/maps/dir/${this.client.latitude},${this.client.longitude}/@//`, "_blank");
    }
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

  updateClientMailbox(mailbox: ClientMailbox) {
    this.service.updateClientMailbox(mailbox).subscribe((data) => {
      console.log(JSON.stringify(data));
    }, error => console.log(error));
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

  private clearPetsFoodRequests(): void {
    const updatePets = (pets: ClientPet[]) => {
      pets.forEach((pet: ClientPet) => {
        if (pet.food_requested === true) {
          pet.food_requested = false;
          this.service.updatePet(pet).subscribe(() => {
            console.log(`Cleared pet food request for pet id ${pet.id}`);
          }, (err) => console.log(err));
        }
      });
    };

    if (this.pets && this.pets.length > 0) {
      updatePets(this.pets);
    } else if (this.clientId) {
      // Ensure we have the client's pets before trying to update them
      this.service.getClientPets(this.clientId).subscribe((pets: ClientPet[]) => {
        this.pets = pets;
        updatePets(this.pets);
      }, (err) => console.log(err));
    }
  }

  updatePetInfo(pet: ClientPet) {
    this.service.updatePet(pet).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  updateHasClientIncome(ci: ClientIncome) {
    ci.has_income = !ci.has_income;
    this.service.updateClientIncome(ci).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  updateClientIncome(ci: ClientIncome) {
    this.service.updateClientIncome(ci).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  updateNextOfKin(nok: ClientNextOfKin) {
    this.service.updateNextOfKin(nok).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  updateHeaterInfo(heater: Heater) {
    this.service.updateHeater(heater).subscribe((data) => {
      console.log(JSON.stringify(data));
    })
  }

  updateTankInfo(tank: any) {
    this.service.updateTank(tank).subscribe((data) => {
      console.log(JSON.stringify(data));
    })
  }

  updateHoseInfo(hose: any) {
    this.service.updateHose(hose).subscribe((data) => {
      console.log(JSON.stringify(data));
    })
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  updateStepDate(step: any, value: string) {
    step.date_completed = value ? new Date(value) : null;
    this.saveStep(step);
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

  sendInteraction(interactionType: number, heatEquipmentAdded: boolean = false) {
    if (!this.isAdmin) {
      alert('Attendance recorded');
    }

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
            if (interaction.serviced_date.valueOf() > new Date(this.client.last_interaction_date).valueOf()) {
              this.client.last_interaction_date = interaction.serviced_date;
            }

            this.createUpdateInteraction(interaction, heatEquipmentAdded);
          } else if (!interaction.still_lives_here) {
            this.client.previous_camp_id = interaction.location_camp_id;
            this.client.current_camp_id = null;

            this.createUpdateInteraction(interaction, heatEquipmentAdded);
          } else {
            this.createUpdateInteraction(interaction, heatEquipmentAdded);
          }
        }
      });
    } else {
      interaction.serviced_date = new Date();
      if (interaction.serviced) {
        this.client.last_interaction_date = new Date();
        this.createUpdateInteraction(interaction, heatEquipmentAdded);
      } else if (!interaction.still_lives_here) {
        this.client.previous_camp_id = interaction.location_camp_id;
        this.client.current_camp_id = null;

        this.createUpdateInteraction(interaction, heatEquipmentAdded);
      } else {
        this.createUpdateInteraction(interaction, heatEquipmentAdded);
      }
    }
  }

  private createUpdateInteraction(interaction: Appearance, heatEquipmentAdded: boolean = false) {
    let routeAttendanceList: Appearance[] = JSON.parse(
      window.localStorage.getItem("RouteAttendance") || '[]'
    );
    let appearance: Appearance = routeAttendanceList.find(
      (x) => x.client_id == interaction.client_id
    );

    console.log(this.client.status);
    if (interaction.serviced && this.client.status === "Inactive") {
      this.client.status = "Active";
    }

    console.log('createUpdateInteraction Heat equipment added: ' + JSON.stringify(heatEquipmentAdded));

    if (appearance) {
      interaction.id = appearance.id;

      this.service.updateClientAppearance(interaction).subscribe(
        (data) => {
          routeAttendanceList[routeAttendanceList.indexOf(appearance)] = interaction;

          if (!interaction.still_lives_here) {
            alert('Please add a new dwelling to indicate where they went and any other applicable notes');
            document.getElementById("newDwellingButton").click();

            // If we haven't loaded pets for this client, fetch them then clear requests
            this.clearPetsFoodRequests();
          }

          let dwellingDates = this.dwellings.map(dwelling => dwelling.created_at);
          let historyDates = this.homelessHistories.map(history => history.created_at);
          let clientDwelling: ClientDwelling = this.dwellings.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0];
          let clientHistory: ClientHomelessHistory = this.homelessHistories.filter(history => history.created_at === historyDates.reduce((a, b) => a > b ? a : b))[0];

          var difference = new Date().getTime() - new Date(clientDwelling.created_at).getTime();
          difference = Math.ceil(difference / (1000 * 3600 * 24));
          if (interaction.serviced && (clientDwelling.dwelling == "House" || clientDwelling.dwelling == "Apartment" || clientDwelling.dwelling == "Shelter" || clientDwelling.dwelling == "Motel" || clientDwelling.dwelling == "Motel") && difference > 90 && clientHistory != null) {

            clientHistory.first_time_homeless = false;
            this.service.updateHomelessHistory(clientHistory).subscribe(data => {

            }, error => console.log(error));
          }

          this.updateClientAndListing(routeAttendanceList, heatEquipmentAdded);
        },
        (error) => console.log(error)
      );
    } else {
      this.service.insertClientAppearance(interaction).subscribe(
        (data) => {
          interaction.id = data.id;
          if (!this.isAdmin) {
            routeAttendanceList.push(interaction);
            window.localStorage.setItem(
              "RouteAttendance",
              JSON.stringify(routeAttendanceList)
            );
          }

          this.clientInteractions.push(data);

          if (!interaction.still_lives_here) {
            alert('Please add a new dwelling to indicate where they went and any other applicable notes');
            document.getElementById("newDwellingButton").click();

            // If we haven't loaded pets for this client, fetch them then clear requests
            this.clearPetsFoodRequests();
          }

          let dwellingDates = this.dwellings.map(dwelling => dwelling.created_at);
          let historyDates = this.homelessHistories.map(history => history.created_at);
          let clientDwelling: ClientDwelling = this.dwellings.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0];
          let clientHistory: ClientHomelessHistory = this.homelessHistories.filter(history => history.created_at === historyDates.reduce((a, b) => a > b ? a : b))[0];

          var difference = new Date().getTime() - new Date(clientDwelling.created_at).getTime();
          difference = Math.ceil(difference / (1000 * 3600 * 24));
          if (interaction.serviced && (clientDwelling.dwelling == "House" || clientDwelling.dwelling == "Apartment" || clientDwelling.dwelling == "Shelter" || clientDwelling.dwelling == "Motel" || clientDwelling.dwelling == "Camper") && difference > 90) {
            clientHistory.first_time_homeless = false;
            this.service.updateHomelessHistory(clientHistory).subscribe(data => {

            }, error => console.log(error));
          }

          this.updateClientAndListing(routeAttendanceList, heatEquipmentAdded);
        },
        (error) => console.log(error)
      );
    }
  }

  private updateClientAndListing(routeAttendanceList: Appearance[], heatEquipmentAdded: boolean = false) {

    this.service.updateClient(this.client).subscribe(
      (data) => {
        let routeAttendanceList: Appearance[] = JSON.parse(
          localStorage.getItem("RouteAttendance") || '[]'
        );
        if (routeAttendanceList.length != null) {
          this.appearance = routeAttendanceList.find(
            (x) => x.client_id == this.clientId
          );
        }

        if (!this.isAdmin && !heatEquipmentAdded) {
          window.localStorage.setItem(
            "RouteAttendance",
            JSON.stringify(routeAttendanceList)
          );
          this.router.navigate([`/locationCamp/${this.locationCampId}`]);
        }
      },
      (error) => console.log(error)
    );
  }

  requestedItemAdded(items: RequestedItem[]) {
    items.forEach(i => {
      this.requestedItems.push(i);
      this.safeScrollTo('#new-item-btn');
    });
  }

  filterReceivedItems(text: string) {
    if (text?.length < 3) {
      this.filteredReceivedItems = this.receivedItems;
      return;
    }

    this.filteredReceivedItems = this.receivedItems.filter(
      item => item.item_description.toLowerCase().includes(text.toLowerCase())
    ).slice(0, 10);
  }

  likeAdded(like: ClientLike) {
    this.clientLikes.push(like);
    this.safeScrollTo('#new-like-btn');
  }

  barrierAdded(barrier: ClientBarrier) {
    this.clientBarriers.push(barrier);
    this.safeScrollTo('#new-barrier-btn');
  }

  incomeAdded(income: ClientIncome) {
    this.clientIncomes.push(income);
    this.safeScrollTo('#new-income-btn');
  }

  nextOfKinAdded(next_of_kin: ClientNextOfKin) {
    this.clientNextOfKins.push(next_of_kin);
    this.safeScrollTo('#new-next-of-kin-btn');
  }

  tentAdded(tent: Tent) {
    this.tents.push(tent);
    this.safeScrollTo('#new-tent-btn');
  }

  caseworkerAdded(caseworker: Caseworker) {
    this.clientCaseworkers.push(caseworker);
    this.safeScrollTo('#new-caseworker-btn');
  }

  mailboxAdded(mailbox: ClientMailbox) {
    this.clientMailbox = mailbox;
    this.safeScrollTo('#new-mailbox-btn');
  }

  authorizedMailAccessAdded(accessor: AuthorizedMailAccesses) {
    this.authorizedMailAccesses.push(accessor);
    this.safeScrollTo('#new-authorized-mail-access-btn');
  }

  clientDwellingAdded(dwelling: ClientDwelling) {
    this.dwellings.push(dwelling);
    this.safeScrollTo('#newDwellingButton');
  }

  clientHistoryAdded(history: ClientHomelessHistory) {
    this.homelessHistories.push(history);
    this.safeScrollTo('#newHistoryButton');
  }

  referralResourceAdded(referralResource: ReferralsResources) {
    this.referralsResources.push(referralResource);
    this.safeScrollTo('#new-referral-btn');
  }

  dislikeAdded(dislike: ClientDislike) {
    this.clientDislikes.push(dislike);
    this.safeScrollTo('#new-dislike-btn');
  }

  editedClient(theClient: Client) {
    this.client = theClient;
    if (this.client.client_picture != null && this.client.client_picture != '') {
      this.url = 'data:image/png;base64,' + this.client.client_picture;
    }
  }

  healthConcernAdded(concern: HealthConcern) {
    this.healthConcerns.push(concern);
    this.safeScrollTo('#new-health-concern-btn');
  }

  goalAdded(goal: GoalsNextStep) {
    this.goalsAndSteps.push(goal);
    this.safeScrollTo('#new-goal-btn');
  }

  prayerRequestAdded(request: PrayerRequestAndNeed) {
    this.prayerRequestsAndNeeds.push(request);
    this.safeScrollTo('#new-prayer-request-btn');
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
    this.safeScrollTo('#new-note-btn');
  }

  petAdded(pet: ClientPet) {
    this.pets.push(pet);
    this.safeScrollTo('#new-pet-btn');
  }

  friendAdded(friend: ClientCircleOfFriends) {
    this.circleOfFriends.push(friend);
    this.safeScrollTo('#new-friend-btn');
  }

  clientHealthInsuranceAdded(insurance: ClientHealthInsurance) {
    this.healthInsurances.push(insurance);
    this.safeScrollTo('#new-health-insurance-btn');
  }

  stepAdded(step: ClientStep) {
    console.log(JSON.stringify(step));
    this.steps.push(step);

    this.safeScrollTo('#new-step-btn');
  }

  clientEvictionAdded(eviction: ClientPastEviction) {
    this.clientPastEvictions.push(eviction);
    this.safeScrollTo('#new-eviction-btn');
  }

  clientFelonyAdded(felony: ClientFelony) {
    this.clientFelonies.push(felony);
    this.safeScrollTo('#new-felony-btn');
  }

  debtAdded(debt: ClientDebt) {
    this.clientDebts.push(debt);
    this.safeScrollTo('#new-debt-btn');
  }

  skillAdded(skill: any) {
    this.clientSkills.push(skill);
    this.safeScrollTo('#new-skill-btn');
  }

  removeClientEviction(id: number) {
    this.service.removePastEviction(id).subscribe((res) => {
      this.clientPastEvictions = this.clientPastEvictions.filter((w) => w.id != id);
    });
  }

  removeClientFelony(id: number) {
    this.service.removeClientFelony(id).subscribe((res) => {
      this.clientFelonies = this.clientFelonies.filter((w) => w.id != id);
    });
  }

  removeClientDebt(id: number) {
    this.service.removeDebt(id).subscribe((res) => {
      this.clientDebts = this.clientDebts.filter((w) => w.id != id);
    });
  }

  removeStep(id: number) {
    this.service.removeClientStep(id).subscribe((res) => {
      this.steps = this.steps.filter((w) => w.id != id);
    });
  }

  removeSkill(id: number) {
    this.service.removeClientSkill(id).subscribe((res) => {
      this.clientSkills = this.clientSkills.filter((w) => w.id != id);
    });
  }

  removeClientMailbox(id: number) {
    if (confirm("Are you sure you want to remove this mailbox?")) {
      this.service.removeClientMailbox(id).subscribe((res) => {
        this.clientMailbox = new ClientMailbox();
      });
    }
  }

  removeAuthorizedMailAccess(id: number) {
    if (confirm("Are you sure you want to remove this authorized mail access user?")) {
      this.service.removeAuthorizedMailAccess(id).subscribe((res) => {
        this.authorizedMailAccesses = this.authorizedMailAccesses.filter((w) => Number(w.id) != id);
      });
    }
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
    this.safeScrollTo('#topOfScreen');
  }

  /**
   * Safely scroll to an element identified by selector.
   * - Defaults to smooth behavior and start block
   * - Supports an optional pixel offset (useful if you have a fixed header)
   */
  private safeScrollTo(selector: string, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }, offset: number = 0): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    if (offset && typeof offset === 'number' && offset !== 0) {
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: options?.behavior });
    } else {
      element.scrollIntoView(options);
    }
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
      let routeAttendanceList: Appearance[] = JSON.parse(
        localStorage.getItem("RouteAttendance")
      );
      if (routeAttendanceList.length != null) {
        this.appearance = routeAttendanceList.find(
          (x) => x.client_id == this.clientId
        );
      }


      if (this.appearance) {
        this.sentInteraction = true;
      }

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
    if (confirm("Are you sure you want to remove this like?")) {
      this.service.removeLike(id).subscribe((res) => {
        this.clientLikes = this.clientLikes.filter((w) => w.id != id);
      });
    }
  }

  removeHealthInsurance(id: number) {
    if (confirm("Are you sure you want to remove this health insurance?")) {
      this.service.removeHealthInsurance(id).subscribe(res => {
        this.healthInsurances = this.healthInsurances.filter((w) => w.id != id);
      });
    }
  }

  removeClientIncome(id: number) {
    if (confirm("Are you sure you want to remove this income?")) {
      this.service.removeIncome(id).subscribe((res) => {
        this.clientIncomes = this.clientIncomes.filter((w) => w.id != id);
      });
    }
  }

  removeClientNextOfKin(id: number) {
    if (confirm("Are you sure you want to remove this next of kin?")) {
      this.service.removeNextOfKin(id).subscribe((res) => {
        this.clientNextOfKins = this.clientNextOfKins.filter((w) => w.id != id);
      });
    }
  }

  removeClientFriend(id: number) {
    if (confirm("Are you sure you want to remove this friend?")) {
      this.service.removeClientFriend(id).subscribe((res) => {
        this.circleOfFriends = this.circleOfFriends.filter((w) => w.id != id);
      });
    }
  }

  removeDislike(id: number) {
    if (confirm("Are you sure you want to remove this dislike?")) {
      this.service.removeDislike(id).subscribe((res) => {
        this.clientDislikes = this.clientDislikes.filter((w) => w.id != id);
      });
    }
  }

  removeClientBarrier(id: number) {
    if (confirm("Are you sure you want to remove this barrier?")) {
      this.service.removeBarrier(id).subscribe((res) => {
        this.clientBarriers = this.clientBarriers.filter((w) => w.id != id);
      });
    }
  }

  removeReferralResource(id: number) {
    if (confirm("Are you sure you want to remove this referral/resource?")) {
      this.service.removeReferralResource(id).subscribe((res) => {
        this.referralsResources = this.referralsResources.filter(
          (w) => w.id != id
        );
      });
    }
  }

  removeReceivedItem(id: number) {
    if (confirm("Are you sure you want to remove this received item?")) {
      this.service.deletedRequestedItem(id).subscribe((res) => {
        this.receivedItems = this.receivedItems.filter((w) => w.id != id);
      });
    }
  }

  removeTent(id: number) {
    if (confirm("Are you sure you want to remove this tent?")) {
      this.service.removeTent(id).subscribe((res) => {
        this.tents = this.tents.filter((w) => w.id != id);
      });
    }
  }

  removeClientDwelling(id: number) {
    if (confirm("Are you sure you want to remove this dwelling?")) {
      this.service.removeClientDwelling(id).subscribe((res) => {
        this.dwellings = this.dwellings.filter((w) => w.id != id);
      });
    }
  }

  removeClientHomelessHistory(id: number) {
    if (confirm("Are you sure you want to remove this homeless history?")) {
      this.service.removeClientHomelessHistory(id).subscribe((res) => {
        this.homelessHistories = this.homelessHistories.filter((w) => w.id != id);
      });
    }
  }

  removeGoal(id: number) {
    if (confirm("Are you sure you want to remove this goal?")) {
      this.service.deleteGoalAndNextStep(id).subscribe((res) => {
        this.goalsAndSteps = this.goalsAndSteps.filter((w) => w.id != id);
      });
    }
  }

  removePet(id: number) {
    if (confirm("Are you sure you want to remove this pet?")) {
      this.service.removePet(id).subscribe((res) => {
        this.pets = this.pets.filter((w) => w.id != id);
      });
    }
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
    if (confirm("Are you sure you want to remove this health concern?")) {
      this.service.removeHealthConcern(id).subscribe((res) => {
        this.healthConcerns = this.healthConcerns.filter((w) => w.id != id);
      });
    }
  }

  removeNote(id: number) {
    if (confirm("Are you sure you want to remove this note?")) {
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
        });
      });
    }
  }

  removePrayerRequestNeed(id: number) {
    if (confirm("Are you sure you want to remove this prayer request/need?")) {
      this.service.removePrayerRequestNeed(id).subscribe((res) => {
        this.prayerRequestsAndNeeds = this.prayerRequestsAndNeeds.filter(
          (w) => w.id != id
        );
      });
    }
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
      this.service.getRecentReceivedItems(this.client.id).subscribe((data: RequestedItem[]) => {
        this.receivedItems = data;
        this.filteredReceivedItems = this.receivedItems.slice(0, 10);
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
          if (!this.isAdmin) { this.sendInteraction(1, true); }
        },
        (error) => console.log(error)
      );
    }
  }

  loanTank() {
    if (this.clientId != null) {
      this.service.loanTank(this.clientId).subscribe((response) => {
        this.service.getClientLoanedTanks(this.clientId).subscribe((data: any) => {
          this.tankInteractions = data;
          if (!this.isAdmin) { this.sendInteraction(1, true); }
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
            if (!this.isAdmin) { this.sendInteraction(1, true); }
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
      });
    },
      (error) => console.log(error)
    );
  }

  isOtherRelationship(value: string): boolean {
    const standard = [
      "Aunt", "Boyfriend", "Caretaker", "Child", "Cousin", "Girlfriend",
      "Grandparent", "Parent", "Sibling", "Spouse/Partner", "Uncle"
    ];
    return value && !standard.includes(value);
  }

  removeClientCaseworker(id: number) {
    if (confirm("Are you sure you want to remove this caseworker?")) {
      this.service.removeClientCaseworker(id).subscribe((res) => {
        this.clientCaseworkers = this.clientCaseworkers.filter((w) => w.id != id);
      });
    }
  }

  toggleOnCart(item: any) {
    item.fulfilled = !item.fulfilled;
    // Optionally, call a service to persist this change to the backend
    this.mainService.updateRequestedItem(item).subscribe();
  }

  saveDwelling(item: any) {
    // Call your service to update the dwelling
    this.service.updateClientDwelling(item).subscribe(() => {
      // Optionally show a success message
    });
  }

  saveStep(step: any) {
    // Call your service to update the step
    this.service.updateClientStep(step).subscribe(() => {
      // Optionally show a success message
    });
  }

  saveHomelessHistory(item: any) {
    // Call your service to update the homeless history record
    this.service.updateHomelessHistory(item).subscribe(() => {
      // Optionally show a success message
    });
  }

  updateHealthInsurance(item: any) {
    this.service.updateClientHealthInsurance(item).subscribe(() => {
      // Optionally show a success message
    });
  }

  formatNextOfKinPhone(nok: any) {
    if (!nok || typeof nok.phone_number !== 'string') return;
    const formatted = formatPhoneNumberValue(nok.phone_number);
    if (nok.phone_number !== formatted) {
      nok.phone_number = formatted;
    }
  }

  formatFriendPhone(friend: any) {
    if (!friend || typeof friend.phone_number !== 'string') return;
    const formatted = formatPhoneNumberValue(friend.phone_number);
    if (friend.phone_number !== formatted) {
      friend.phone_number = formatted;
    }
  }

  formatCaseworkerPhone(caseworker: Caseworker) {
    if (!caseworker || typeof caseworker.phone !== 'string') return;
    const formatted = formatPhoneNumberValue(caseworker.phone);
    if (caseworker.phone !== formatted) {
      caseworker.phone = formatted;
    }
  }

  formatNextOfKinPhoneNumber(nok: any) {
    if (!nok || typeof nok.phone_number !== 'string') return;
    const formatted = formatPhoneNumberValue(nok.phone_number);
    if (nok.phone_number !== formatted) {
      nok.phone_number = formatted;
    }
  }
}
