import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class InputService {
    API_URL = environment.API_URL + '/input';

    constructor(private http: HttpClient) {}

    processInput(inputData: any) {
        return this.http.post<any>(this.API_URL, inputData);
    }
}
