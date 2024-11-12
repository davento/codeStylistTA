import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Course } from "src/app/shared/interfaces/Course";

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    API_URL = environment.API_URL + '/course';

    constructor(private http: HttpClient) {}

    getCourses(){
        const url = this.API_URL;
        return this.http.get<Course[]>(url);
    }

    getCourseByCode(code: number){
        const url = this.API_URL + '/' + code;
        return this.http.get<any>(url);
    }
}