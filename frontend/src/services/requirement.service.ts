import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Requirement } from '../models/requirement.model';
import { environment } from '../environments/environment';
import { QueueStatus } from '../types/queue.status.type';
import { QueueItem } from '../models/queue.item.model';

const API_BASE_URL: string = `${environment.backendUrl}/api`

@Injectable({ providedIn: 'root' })
export class RequirementService {
  constructor(private http: HttpClient) {}

  submitTextForParsing(query: string): Observable<Requirement[]> {
    return this.http.post<Requirement[]>(`${API_BASE_URL}/requirement-parsing`, { query });
  }

  submitToQueue(requirements: Requirement[]): Observable<any> {
    return this.http.post(`${API_BASE_URL}/queue`, { requirements });
  }

  getQueueByStatus(status: QueueStatus): Observable<QueueItem[]> {
    return this.http.get<{ status: string; data: QueueItem[] }>(`${API_BASE_URL}/queue/${status}`)
      .pipe(
        // csak a data részt adjuk tovább
        map(response => response.data)
      );
  }
}
