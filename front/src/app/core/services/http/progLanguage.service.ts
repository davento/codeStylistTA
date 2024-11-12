import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ProgLanguage } from "src/app/shared/interfaces/ProgLanguage";

@Injectable({
    providedIn: "root",
})
export class ProgLanguageService {
    API_URL = environment.API_URL + '/prog-lang';

    constructor(private http: HttpClient) {}

    getProgLanguages() {
        const url = this.API_URL;
        return this.http.get<ProgLanguage[]>(url);
    }
}