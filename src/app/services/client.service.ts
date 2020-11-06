import { Injectable }    from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Route } from '../models/route';
import { ClientLike } from '../models/client-like';
import { ClientDislike } from '../models/client-dislike';
import { Client } from '../models/client';
import { LocationCamp } from '../models/location-camp';
import { Appearance } from '../models/appearance';
import { HealthConcern } from '../models/health-concern';
import { RequestedItem } from '../models/requested-item';

import 'rxjs/add/operator/toPromise';

import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { PrayerRequestAndNeed } from "app/models/prayer-request";
import { GoalsNextStep } from "app/models/goals-next-steps";
import { Router } from '@angular/router';
import { Note } from 'app/models/note';
import { ClientPet } from 'app/models/client-pet';


// adding a new comment
@Injectable()
export class ClientService {
  theHeader = new HttpHeaders().set('Content-Type', 'application/json');
  online = true;
  private baseUrl = 'https://joppa-api-test.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>, private router: Router) { 
    console.log(this.baseUrl);
  }
  getClientLikes(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `likesForClient?clientId=${id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    })
        .catch(this.handleError);
  }

  getClientDislikes(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `dislikesForClient?clientId=${id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    })
        .catch(this.handleError);
  }

  getClientById(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `clients/${id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    })
  }

  getBirthdaysByMonth(monthInt: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getClientsByBirthMonth?monthInt=${monthInt}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getNewClients() {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getNewClients`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getClientsNewToCamps() {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getClientsNewToCamps`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getClientNotesForRoute(clientId: number, routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getClientNotesForRoute?clientId=${clientId}&routeInstanceId=${routeInstanceId}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getClientNotesForClient(clientId: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getClientNotesForClient?clientId=${clientId}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  insertClientLike(theClientLike: ClientLike) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `client_likes`, {client_like: theClientLike}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  insertClientDislike(theClientDislike: ClientDislike) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `client_dislikes`, {client_dislike: theClientDislike}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  insertNote(theNote: Note) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `client_notes`, {client_note: theNote}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  insertClientAppearance(clientAppearance: Appearance){
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `client_interactions`, {client_interaction: clientAppearance}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  updateClientAppearance(clientAppearance: Appearance) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.patch(this.baseUrl + `client_interactions/${clientAppearance.id}`, {client_interaction: clientAppearance}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  getHeatersForClient(theClientId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getCurrentHeatersForClient?clientId=${theClientId}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  updateHeaterClient(theClientId, theHeaterId, theStatusId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `updateHeaterClient?clientId=${theClientId}&heaterId=${theHeaterId}&status=${theStatusId}`,{headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getCheckedOutHeaters(id:number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }).catch(err => this.handleError(err));
  }

  getClientsByName(name) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    if (name == '') {
      name = 'ALLCLIENTS';
    }
    return this.http.get(this.baseUrl + `getClientsByName?name=${name}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  insertClient(theClient: Client) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `clients`, {client: theClient}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  updateClient(theClient: Client) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.patch(this.baseUrl + `clients/${theClient.id}`, { client: theClient}, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  insertHealthConcern(concern : HealthConcern) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `health_concerns`, {health_concern: concern}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  getHealthConcerns(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.get(this.baseUrl + `getClientHealthConcerns?clientId=${id}`, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  insertRequestedItem(item: RequestedItem) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    item.has_received = false;
      return this.http.post(this.baseUrl + `requested_items`, {requested_item: item}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  getRequestedItems(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.get(this.baseUrl + `getClientRequestedItem?clientId=${id}`, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  insertPet(pet: ClientPet) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    
    return this.http.post(this.baseUrl + `client_pets`, {client_pet: pet}, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getClientPets(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    
    return this.http.get(this.baseUrl + `getClientPets?clientId=${id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getClientHousehold(household_id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    
    return this.http.get(this.baseUrl + `getHousehold?householdId=${household_id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  deletedRequestedItem(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `requested_items/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  removeLike(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `client_likes/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  removeDislike(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `client_dislikes/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  removePet(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `client_pets/${id}`, {headers: myHeader}).map((res: any) => {
      if (res!= null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  removeHealthConcern(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `health_concerns/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  removeNote(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `client_notes/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  removePrayerRequestNeed(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `prayer_request_and_needs/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  completePrayerRequestNeed(thePrayerRequestNeed: PrayerRequestAndNeed) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.patch(this.baseUrl + `prayer_request_and_needs/${thePrayerRequestNeed.id}`, {prayer_request_and_need: thePrayerRequestNeed}, {headers: myHeader})
        .map((res: any) => {
            if (res.message === 'invalid-token') {
              window.localStorage.removeItem('apiToken');
              this.router.navigate(['/application-login']);
            }
            return res;
          } );
  }

  deleteGoalAndNextStep(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.delete(this.baseUrl + `goals_and_next_steps/${id}`, {headers: myHeader}).map((res: any) => {
      if (res != null && res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  completeGoalAndNextStep(theGoal: GoalsNextStep) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.patch(this.baseUrl + `goals_and_next_steps/${theGoal.id}`, {goals_and_next_step: theGoal}, {headers: myHeader})
        .map((res: any) => {
            if (res.message === 'invalid-token') {
              window.localStorage.removeItem('apiToken');
              this.router.navigate(['/application-login']);
            }
            return res;
          } );
  }

  receivedRequestedItem(id: number) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `receivedRequestedItem/?requestId=${id}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getRecentReceivedItems(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `recentReceivedItems?clientId=${id}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getGoalsAndNextSteps(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `goalsForClient?clientId=${id}`, {headers: myHeader})
    .map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  insertGoalAndStep(goal : GoalsNextStep) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.post(this.baseUrl + `goals_and_next_steps`, {goals_and_next_step: goal}, {headers: myHeader})
      .map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  getClientPrayerRequests(id) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `prayerRequestsForClient?clientId=${id}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  insertClientPrayerRequest(prayerRequest: PrayerRequestAndNeed) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.post(this.baseUrl + `prayer_request_and_needs`, {prayer_request_and_need: prayerRequest},
      {headers: myHeader}).map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  getHeatEquipmentNotReturned(clientId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return Observable.forkJoin(
      this.http.get(this.baseUrl + `getHeatersNotReturnedForClient?clientId=${clientId}`, {headers: myHeader}),
      this.http.get(this.baseUrl + `getHosesNotReturnedForClient?clientId=${clientId}`, {headers: myHeader}),
      this.http.get(this.baseUrl + `getTanksNotReturnedForClient?clientId=${clientId}`, {headers: myHeader})
    ).map(data => {
      const resultArray = [];
      const heaters = data[0] as any[];
      const hoses = data[1] as any[];
      const tanks = data[2] as any[];
      heaters.forEach(item => {
        resultArray.push({Type: 'Heater', created_at: item.created_at, status_id: item.status_id, updated_at: item.updated_at});
      });
      hoses.forEach(item => {
        resultArray.push({Type: 'Hose', created_at: item.created_at, status_id: item.heater_status_id, updated_at: item.updated_at});
      });
      tanks.forEach(item => {
        resultArray.push({Type: 'Tank', created_at: item.created_at, status_id: item.status_id, updated_at: item.updated_at});
      });
      return resultArray;
    });
  }

  getAllRequestedItems() {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
      return this.http.get(this.baseUrl + `getAllRequestedItems`, {headers: myHeader}).map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      });
  }

  getClientLoanedTanks(clientId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getTanksLoanedToClient?clientId=${clientId}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  getClientLoanedHoses(clientId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl + `getHosesLoanedToClient?clientId=${clientId}`, {headers: myHeader}).map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    });
  }

  loanTank(clientId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.post(this.baseUrl + `client_tank_interactions`,
                {client_tank_interaction: {client_id: clientId, status_id: 2}}, {headers: myHeader})
                .map((res: any) => {
                  if (res.message === 'invalid-token') {
                    window.localStorage.removeItem('apiToken');
                    this.router.navigate(['/application-login']);
                  }
                  return res;
                });
  }

  loanHose(clientId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.post(this.baseUrl + `client_hose_interactions`,
                {client_hose_interaction: {client_id: clientId, heater_status_id: 2}}, {headers: myHeader})
                .map((res: any) => {
                  if (res.message === 'invalid-token') {
                    window.localStorage.removeItem('apiToken');
                    this.router.navigate(['/application-login']);
                  }
                  return res;
                });
  }

  updateTankInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl +
                    `updateTankInteraction?interactionId=${interactionId}&statusId=${statusId}`, {headers: myHeader})
                    .map((res: any) => {
                      if (res.message === 'invalid-token') {
                        window.localStorage.removeItem('apiToken');
                        this.router.navigate(['/application-login']);
                      }
                      return res;
                    });
  }

  updateHoseInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl +
                  `updateHoseInteraction?interactionId=${interactionId}&statusId=${statusId}`, {headers: myHeader})
                  .map((res: any) => {
                    if (res.message === 'invalid-token') {
                      window.localStorage.removeItem('apiToken');
                      this.router.navigate(['/application-login']);
                    }
                    return res;
                  });
  }

  updateHeaterInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('apiToken')
    });
    return this.http.get(this.baseUrl +
                  `updateHeaterInteraction?interactionId=${interactionId}&statusId=${statusId}`, {headers: myHeader})
                  .map((res: any) => {
                    if (res.message === 'invalid-token') {
                      window.localStorage.removeItem('apiToken');
                      this.router.navigate(['/application-login']);
                    }
                    return res;
                  });
  }

  private mapLocations(data: Array<any>): LocationCamp[] {
    return data.map(item =>
      <LocationCamp>({
        id: item.id,
        route_id: item.route_id,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        notes: item.notes,
        position: item.position
      })
    );
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.store.dispatch({ type: 'USER_API_ERROR', payload: {'message': errMsg}});
    return Observable.throw(errMsg);
  }
}