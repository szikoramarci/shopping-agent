import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Requirement } from '../models/requirement.model';

@Injectable({ providedIn: 'root' })
export class RequirementService {
  constructor(private http: HttpClient) {}

  submitTextForParsing(text: string): Observable<Requirement[]> {
    return this.http.post<Requirement[]>('/api/parse', { text });
  }

  submitToQueue(requirements: Requirement[]): Observable<any> {
    return this.http.post('/api/queue', { requirements });
  }
}
