import { Injectable }    from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Route } from '../models/route';
import { ClientLike } from '../models/client-like';
import { ClientDislike } from '../models/client-dislike';
import { Client } from '../models/client';
import { Location } from '../models/location';
import { Appearance } from '../models/appearance';
import { HealthConcern } from '../models/health-concern';
import { RequestedItem } from '../models/requested-item';

import 'rxjs/add/operator/toPromise';

import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { PrayerRequestAndNeed } from "app/models/prayer-request";

const theHeader = new HttpHeaders().set('Content-Type', 'application/json');
//adding a new comment
@Injectable()
export class ClientService {
  online = true;
  private baseUrl = 'api/';  // URL to web api
  private apiUrl = 'https://hidden-springs-63744.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>) { }
  getClientLikes(id) {
    return this.http.get(this.baseUrl + `getClientLikes?clientId=${id}`)
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  getClientDislikes(id) {
    return this.http.get(this.baseUrl + `getClientDislikes?clientId=${id}`)
        .map((response) => {
          console.log('results:');
          console.log(response);
          response;
        })
        .catch(this.handleError);
  }

  insertClientLike(theClientLike : ClientLike) {
      return this.http.post(this.baseUrl + `client_likes`, {client_like: theClientLike}, {headers: theHeader})
        .map(response => response);
  }

  insertClientDislike(theClientDislike: ClientDislike) {
      return this.http.post(this.baseUrl + `client_dislikes`, {client_dislike: theClientDislike}, {headers: theHeader})
            .map(response => response);
  }
// OBSOLETE
  insertClientAppearance(clientAppearance: Appearance){
      return this.http.post(this.baseUrl + `clientAppearances`, {client_appearance: clientAppearance}, {headers: theHeader})
        .map(response => response);
  }
// OBSOLETE
  getClientsByName(name) {
    return this.http.get(this.baseUrl + `getClientsByName?name=${name}`)
        .map(response => response);
  }

  insertClient(theClient: Client) {
      return this.http.post(this.baseUrl + `clients`, {client: theClient}, {headers: theHeader})
        .map(response => response);
  }
// OBSOLETE NOT IN DB
  insertHealthConcern(concern : HealthConcern) {
      return this.http.post(this.baseUrl + `InsertClientHealthConcern.php`, concern)
        .map(response => response);
  }
// OBSOLETE NOT IN DB
  getHealthConcerns(id) {
      return this.http.get(this.baseUrl + `GetClientHealthConcerns.php?clientId=${id}`)
        .map(response => response);
  }

  insertRequestedItem(item : RequestedItem) {
      return this.http.post(this.baseUrl + `requestedItems`, {requested_item: item}, {headers: theHeader})
        .map(response => response);
  }

  getRequestedItems(id) {
      return this.http.get(this.baseUrl + `getClientRequestedItem?clientId=${id}`)
        .map(response => response);
  }

  getClientPrayerRequests(id) {
    return this.http.get(this.baseUrl + `getClientPrayerRequests?clientId=${id}`)
  }

  insertClientPrayerRequest(prayerRequest: PrayerRequestAndNeed) {
    return this.http.post(this.baseUrl + `prayer_request_and_needs`, {prayer_request_and_need: prayerRequest},
      {headers: theHeader}).map(response => response);
  }

  getAllRequestedItems() {
      return this.http.get(this.baseUrl + `getAllRequestedItems`).map(response => response);
  }

  private mapLocations(data: Array<any>): Location[] {
    return data.map(item => 
      <Location>({
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