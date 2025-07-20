import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Requirement } from '../models/requirement.model';
import { environment } from '../environments/environment';

const API_BASE_URL: string = `${environment.backendUrl}/api`

@Injectable({ providedIn: 'root' })
export class RequirementService {
  constructor(private http: HttpClient) {}

  submitTextForParsing(text: string): Observable<Requirement[]> {
    return this.http.post<Requirement[]>(`${API_BASE_URL}/requirement-parsing`, { text });
  }

  submitToQueue(requirements: Requirement[]): Observable<any> {
    return this.http.post(`${API_BASE_URL}/queue`, { requirements });
  }
}
