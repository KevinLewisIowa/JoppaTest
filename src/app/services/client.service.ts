import { throwError as observableThrowError, Observable, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ClientLike } from "../models/client-like";
import { ClientDislike } from "../models/client-dislike";
import { Client } from "../models/client";
import { LocationCamp } from "../models/location-camp";
import { Appearance } from "../models/appearance";
import { HealthConcern } from "../models/health-concern";
import { RequestedItem } from "../models/requested-item";
import { PrayerRequestAndNeed } from "app/models/prayer-request";
import { GoalsNextStep } from "app/models/goals-next-steps";
import { Router } from "@angular/router";
import { Note } from "app/models/note";
import { ClientPet } from "app/models/client-pet";
import { Tent } from "app/models/tent";
import { ReferralsResources } from "app/models/referrals-resources";
import { ClientDwelling } from "app/models/client-dwelling";
import { ClientCircleOfFriends } from "app/models/client-circle-of-friends";
import { environment } from "environments/environment";
import { map, catchError } from "rxjs/operators";
import { ClientIncome } from "app/models/client-income";
import { ClientNextOfKin } from "app/models/client-next-of-kin";
import { ClientHomelessHistory } from "app/models/client-homeless-histories";
import { Heater } from "app/models/heater";
import { ClientDebt } from "app/models/client-debt";
import { ClientFelony } from "app/models/client-felony";
import { ClientPastEviction } from "app/models/client-past-eviction";
import { ClientStep } from "app/models/client-step";
import { ClientSkill } from "app/models/client-skill";
import { ClientHealthInsurance } from "app/models/client-health-insurance";

@Injectable()
export class ClientService {
  theHeader = new HttpHeaders().set("Content-Type", "application/json");
  online = true;
  private baseUrl = environment.api_url;

  constructor(private http: HttpClient, private router: Router) {
    console.log(this.baseUrl);
  }

  getClientLikes(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `likesForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientDislikes(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `dislikesForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }, catchError(this.handleError))
      );
  }

  getClientById(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `clients/${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  seenAndServicedReport(fromDate: string, toDate: string) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `seen_and_serviced_report?fromDate=${fromDate}&toDate=${toDate}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientAttendanceForRoute(route_id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientAttendanceForRoute?routeId=${route_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getBirthdaysByMonth(monthInt: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientsByBirthMonth?monthInt=${monthInt}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getNewClients() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getNewClients`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientsNewToCamps() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientsNewToCamps`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientNotesForRoute(clientId: number, routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `getClientNotesForRoute?clientId=${clientId}&routeInstanceId=${routeInstanceId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientNotesForClient(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientNotesForClient?clientId=${clientId}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientLike(theClientLike: ClientLike) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_likes`,
        { client_like: theClientLike },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientDislike(theClientDislike: ClientDislike) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_dislikes`,
        { client_dislike: theClientDislike },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertNote(theNote: Note) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_notes`,
        { client_note: theNote },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientDwelling(theDwelling: ClientDwelling) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_dwellings`,
        { client_dwelling: theDwelling },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientDwellings(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getDwellingsForClient?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClientDwelling(theDwelling: ClientDwelling) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_dwellings/${theDwelling.id}`,
        { client_dwelling: theDwelling },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientHomelessHistory(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getDwellingHistoriesForClient?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientHomelessHistory(theHistory: ClientHomelessHistory) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_homeless_histories`,
        { client_homeless_history: theHistory },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHomelessHistory(theHistory: ClientHomelessHistory) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_homeless_histories/${theHistory.id}`,
        { client_homeless_history: theHistory },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClientNote(theNote: Note) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_notes/${theNote.id}`,
        { client_note: theNote },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removeClientDwelling(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_dwellings/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeClientHomelessHistory(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_homeless_histories/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  getTentsForClient(client_id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getTentsForClient?clientId=${client_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          console.log(res);
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientTent(theTent: Tent) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_tents`,
        { client_tent: theTent },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientAppearance(clientAppearance: Appearance) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_interactions`,
        { client_interaction: clientAppearance },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClientAppearance(clientAppearance: Appearance) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_interactions/${clientAppearance.id}`,
        { client_interaction: clientAppearance },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHeatersForClient(theClientId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl + `getCurrentHeatersForClient?clientId=${theClientId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHeaterClient(theClientId, theHeaterId, theStatusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateHeaterClient?clientId=${theClientId}&heaterId=${theHeaterId}&status=${theStatusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCheckedOutHeaters(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientsByName(name) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    if (name == "") {
      name = "ALLCLIENTS";
    }
    return this.http
      .get(this.baseUrl + `getClientsByName?name=${name}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClient(theClient: Client) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `clients`,
        { client: theClient },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClient(theClient: Client) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `clients/${theClient.id}`,
        { client: theClient },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updatePet(thePet: ClientPet) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_pets/${thePet.id}`,
        { client_pet: thePet },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHeater(theHeater: Heater) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `heaters/${theHeater.id}`,
        { heater: theHeater },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateTank(theTank: any) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_tank_interactions/${theTank.id}`,
        { client_tank_interaction: theTank },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHose(theHose: any) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_hose_interactions/${theHose.id}`,
        { client_hose_interaction: theHose },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }
  
  updateCircleOfFriends(theFriend: ClientCircleOfFriends) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_circle_of_friends/${theFriend.id}`,
        { client_circle_of_friend: theFriend },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertHealthConcern(concern: HealthConcern) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `health_concerns`,
        { health_concern: concern },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHealthConcerns(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientHealthConcerns?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertRequestedItem(item: RequestedItem) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    item.has_received = false;
    return this.http
      .post(
        this.baseUrl + `requested_items`,
        { requested_item: item },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequestedItems(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientRequestedItem?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertPet(pet: ClientPet) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_pets`,
        { client_pet: pet },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertFriend(friend: ClientCircleOfFriends) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_circle_of_friends`,
        { client_circle_of_friend: friend },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertDebt(debt: ClientDebt) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_debts`,
        { client_debt: debt },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientDebt(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientDebt?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removeDebt(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.delete(this.baseUrl + `client_debts/${id}`, { headers: myHeader }).pipe(
      map((res) => {
        return true;
      }), catchError(this.handleError)
    );
  }

  insertFelony(felony: ClientFelony) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_felonies`,
        { client_felony: felony },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientFelonies(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientFelonies?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removeClientFelony(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.delete(this.baseUrl + `client_felonies/${id}`, { headers: myHeader }).pipe(
      map((res) => {
        return true;
      }), catchError(this.handleError)
    );
  }

  insertPastEviction(eviction: ClientPastEviction) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_past_evictions`,
        { client_past_eviction: eviction },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPastEvictions(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getPastEvictions?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removePastEviction(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.delete(this.baseUrl + `client_past_evictions/${id}`, { headers: myHeader }).pipe(
      map((res) => {
        return true;
      }
      ), catchError(this.handleError)
    );
  }

  insertStep(step: ClientStep) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_steps`,
        { client_step: step },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientSteps(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientSteps?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removeClientStep(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_steps/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  insertSkill(skill: ClientSkill) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_skills`,
        { client_skill: skill },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientSkills(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientSkills?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertHealthInsurance(insurance: ClientHealthInsurance) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_health_insurances`,
        { client_health_insurance: insurance },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientHealthInsurance(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientHealthInsurance?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientPets(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientPets?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientCircleOfFriends(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getFriendsForClient?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getAllClientPets() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `client_pets`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientHousehold(household_id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getHousehold?householdId=${household_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removeReferralResource(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_referrals/${id}`, { headers: myHeader, })
      .pipe(map((res) => {
          return true;
        }), catchError(this.handleError));
  }

  removeClientFriend(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_circle_of_friends/${id}`, { headers: myHeader, })
      .pipe(map((res) => {
          return true;
        }), catchError(this.handleError));
  }

  deletedRequestedItem(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `requested_items/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeLike(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_likes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeHealthInsurance(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_health_insurances/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeIncome(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_incomes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeNextOfKin(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_next_of_kins/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeAppearance(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_interactions/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeDislike(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_dislikes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeTent(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_tents/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removePet(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_pets/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeHealthConcern(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `health_concerns/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeNote(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_notes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removePrayerRequestNeed(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `prayer_request_and_needs/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  completePrayerRequestNeed(thePrayerRequestNeed: PrayerRequestAndNeed) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `prayer_request_and_needs/${thePrayerRequestNeed.id}`,
        { prayer_request_and_need: thePrayerRequestNeed },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteGoalAndNextStep(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `goals_and_next_steps/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  completeGoalAndNextStep(theGoal: GoalsNextStep) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `goals_and_next_steps/${theGoal.id}`,
        { goals_and_next_step: theGoal },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  receivedRequestedItem(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `receivedRequestedItem/?requestId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRecentReceivedItems(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `recentReceivedItems?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientReferralResource(referralsResources: ReferralsResources) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.baseUrl + `client_referrals`,{ client_referral: referralsResources }, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getGoalsAndNextSteps(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `goalsForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertGoalAndStep(goal: GoalsNextStep) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `goals_and_next_steps`,
        { goals_and_next_step: goal },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientIncome(income: ClientIncome) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_incomes`,
        { client_income: income },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClientIncome(theIncome: ClientIncome) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_incomes/${theIncome.id}`,
        { client_income: theIncome },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientIncomes(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientIncomes?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateNextOfKin(theNextOfKin: ClientNextOfKin) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_next_of_kins/${theNextOfKin.id}`,
        { client_next_of_kin: theNextOfKin },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientNextOfKin(nextOfKin: ClientNextOfKin) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_next_of_kins`,
        { client_next_of_kin: nextOfKin },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientNextOfKins(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientNextOfKins?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientPrayerRequests(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `prayerRequestsForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientReferrals(client_id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientReferrals?clientId=${client_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientPrayerRequest(prayerRequest: PrayerRequestAndNeed) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `prayer_request_and_needs`,
        { prayer_request_and_need: prayerRequest },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHeatEquipmentNotReturned(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return forkJoin([
      this.http.get(
        this.baseUrl + `getHeatersNotReturnedForClient?clientId=${clientId}`,
        { headers: myHeader }
      ),
      this.http.get(
        this.baseUrl + `getHosesNotReturnedForClient?clientId=${clientId}`,
        { headers: myHeader }
      ),
      this.http.get(
        this.baseUrl + `getTanksNotReturnedForClient?clientId=${clientId}`,
        { headers: myHeader }
      ),
    ]).pipe(
      map((data) => {
        const resultArray = [];
        const heaters = data[0] as any[];
        const hoses = data[1] as any[];
        const tanks = data[2] as any[];
        heaters.forEach((item) => {
          resultArray.push({
            Type: "Heater",
            created_at: item.created_at,
            status_id: item.status_id,
            updated_at: item.updated_at,
          });
        });
        hoses.forEach((item) => {
          resultArray.push({
            Type: "Hose",
            created_at: item.created_at,
            status_id: item.heater_status_id,
            updated_at: item.updated_at,
          });
        });
        tanks.forEach((item) => {
          resultArray.push({
            Type: "Tank",
            created_at: item.created_at,
            status_id: item.status_id,
            updated_at: item.updated_at,
          });
        });
        return resultArray;
      }),
      catchError(this.handleError)
    );
  }

  getAllRequestedItems() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getAllRequestedItems`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientLoanedTanks(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getTanksLoanedToClient?clientId=${clientId}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientLoanedHoses(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getHosesLoanedToClient?clientId=${clientId}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  loanTank(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_tank_interactions`,
        { client_tank_interaction: { client_id: clientId, status_id: 2 } },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  loanHose(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_hose_interactions`,
        {
          client_hose_interaction: { client_id: clientId, heater_status_id: 2 },
        },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateTankInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateTankInteraction?interactionId=${interactionId}&statusId=${statusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHoseInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateHoseInteraction?interactionId=${interactionId}&statusId=${statusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHeaterInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateHeaterInteraction?interactionId=${interactionId}&statusId=${statusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  private mapLocations(data: Array<any>): LocationCamp[] {
    return data.map(
      (item) =>
        <LocationCamp>{
          id: item.id,
          route_id: item.route_id,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          notes: item.notes,
          position: item.position,
        }
    );
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return observableThrowError(errMsg);
  }
}
