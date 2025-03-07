import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class CountryStateCityService {
    online = true;
    private baseUrl = "https://api.countrystatecity.in/v1/";
    private apiKey = "dWZJc01NYjl6YmVxSHcyTEhkQjdVSWtCV1BQdHpENFpYNDk4bmNWTg==";

    constructor(private http: HttpClient, private router: Router) {
    }

    public async getCitiesByCountryAndState(state: string): Promise<string[]> {
        try {
            if (!this.http) {
                throw new Error('HttpClient is not defined');
            }
            const headers = new HttpHeaders({
                'X-CSCAPI-KEY': this.apiKey,
            });
            const response = await firstValueFrom(
                this.http.get<any[]>(`${this.baseUrl}countries/US/states/${state}/cities`, { headers })
            );
            return response.map(city => city.name);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

}