import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface SchedulerMetrics {
  recordsProcessed: number;
  durationSeconds: number;
}

export interface Scheduler {
  id: number;
  name: string;
  moduleCode: string | null;
  jobClass: string;
  lastRunTime: Date;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'DISABLED';
  nextRunTime: Date;
  frequency: string;
  metrics?: SchedulerMetrics;
  errorMessage?: string;
  isEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  constructor() { }

  getSchedulers(): Observable<Scheduler[]> {
    const now = new Date();
    const tenMinsAgo = new Date(now.getTime() - 10 * 60000);
    const inFiveMins = new Date(now.getTime() + 5 * 60000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60000);
    
    return of([
      {
        id: 1,
        name: 'SB Extract Daily',
        moduleCode: 'SB',
        jobClass: 'SbExtractJob',
        lastRunTime: yesterday,
        status: 'SUCCESS',
        nextRunTime: new Date(now.getTime() + 60 * 60000),
        frequency: 'Daily at 9 AM',
        metrics: { recordsProcessed: 1542, durationSeconds: 45 },
        isEnabled: true
      },
      {
        id: 2,
        name: 'Maturity Approval Sync',
        moduleCode: 'MAT',
        jobClass: 'MatApproveJob',
        lastRunTime: tenMinsAgo,
        status: 'RUNNING',
        nextRunTime: inFiveMins,
        frequency: 'Every 15 mins',
        isEnabled: true
      },
      {
        id: 3,
        name: 'Payment Gateway Sync',
        moduleCode: null,
        jobClass: 'PaymentSyncJob',
        lastRunTime: tenMinsAgo,
        status: 'FAILED',
        nextRunTime: inFiveMins,
        frequency: 'Every 5 mins',
        metrics: { recordsProcessed: 0, durationSeconds: 5 },
        errorMessage: 'Connection timeout to PG gateway',
        isEnabled: true
      },
      {
        id: 4,
        name: 'Surrender Calculation',
        moduleCode: 'SUR',
        jobClass: 'SurrenderCalcJob',
        lastRunTime: yesterday,
        status: 'DISABLED',
        nextRunTime: new Date(now.getTime() + 120 * 60000),
        frequency: '0 0 12 * * ?',
        isEnabled: false
      }
    ] as Scheduler[]).pipe(delay(500));
  }

  triggerRun(id: number): Observable<boolean> {
    return of(true).pipe(delay(800));
  }

  toggleStatus(id: number, enabled: boolean): Observable<boolean> {
    return of(true).pipe(delay(400));
  }
}
