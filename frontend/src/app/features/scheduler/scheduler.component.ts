import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Scheduler, SchedulerService } from './scheduler.service';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  template: `
    <div class="header-section animate-fade-in">
      <div>
        <h1 class="page-title">Scheduler Management</h1>
        <p class="text-muted">Monitor and manage automated background jobs</p>
      </div>
      <button mat-flat-button color="primary">
        <mat-icon>add</mat-icon> Add Scheduler
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-card animate-fade-in" style="animation-delay: 0.1s">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search Schedulers</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput [(ngModel)]="searchQuery" placeholder="Search by name or job class">
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="statusFilter">
          <mat-option value="ALL">All Statuses</mat-option>
          <mat-option value="SUCCESS">Success</mat-option>
          <mat-option value="FAILED">Failed</mat-option>
          <mat-option value="RUNNING">Running</mat-option>
          <mat-option value="DISABLED">Disabled</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Module</mat-label>
        <mat-select [(ngModel)]="moduleFilter">
          <mat-option value="ALL">All Modules</mat-option>
          <mat-option value="SB">Survival Benefit (SB)</mat-option>
          <mat-option value="MAT">Maturity</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <!-- Table -->
    <div class="table-container animate-fade-in" style="animation-delay: 0.2s">
      <table mat-table [dataSource]="filteredSchedulers" class="scheduler-table">
        
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Scheduler Name </th>
          <td mat-cell *matCellDef="let element"> 
            <div class="name-cell">
              <span class="main-name">{{ element.name }}</span>
              <span class="sub-name text-muted">{{ element.jobClass }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Last Run Status </th>
          <td mat-cell *matCellDef="let element">
            <div class="status-badge" [ngClass]="element.status.toLowerCase()">
              <span class="dot" *ngIf="element.status === 'RUNNING'"></span>
              {{ element.status }}
            </div>
            <div *ngIf="element.errorMessage" class="error-msg" [title]="element.errorMessage">
              <mat-icon>error_outline</mat-icon> {{ element.errorMessage }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="lastRun">
          <th mat-header-cell *matHeaderCellDef> Last Run </th>
          <td mat-cell *matCellDef="let element"> 
            {{ element.lastRunTime | date:'short' }}
            <div class="metrics" *ngIf="element.metrics">
              {{ element.metrics.recordsProcessed }} recs in {{ element.metrics.durationSeconds }}s
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="nextRun">
          <th mat-header-cell *matHeaderCellDef> Next Run / Freq </th>
          <td mat-cell *matCellDef="let element"> 
            <div class="next-time">{{ element.nextRunTime | date:'shortTime' }}</div>
            <div class="frequency text-muted">{{ element.frequency }}</div>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-header"> Actions </th>
          <td mat-cell *matCellDef="let element" class="actions-cell"> 
            <mat-slide-toggle 
              color="primary"
              [checked]="element.isEnabled"
              (change)="toggleStatus(element, $event.checked)"
              class="toggle-btn">
            </mat-slide-toggle>

            <button mat-icon-button color="primary" matTooltip="Run Now" (click)="triggerRun(element)" [disabled]="element.status === 'RUNNING'">
              <mat-icon>play_circle</mat-icon>
            </button>
            
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item>
                <mat-icon>history</mat-icon>
                <span>View History</span>
              </button>
              <button mat-menu-item>
                <mat-icon>edit</mat-icon>
                <span>Edit Config</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        
      </table>
      
      <div *ngIf="filteredSchedulers.length === 0 && !isLoading" class="empty-state">
        <mat-icon>event_busy</mat-icon>
        <p>No schedulers found matching filters.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-title { margin: 0 0 4px 0; font-size: 24px; font-weight: 600; }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    
    .filter-card {
      background: white; border-radius: 8px; padding: 20px 20px 0; display: flex; gap: 16px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .search-field { flex: 1; min-width: 300px; }
    .filter-field { width: 200px; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }

    .table-container {
      background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;
    }
    .scheduler-table { width: 100%; }
    
    .name-cell { display: flex; flex-direction: column; }
    .main-name { font-weight: 600; color: #1E293B; font-size: 14px; }
    .sub-name { font-size: 12px; margin-top: 2px; }

    .status-badge {
      display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      &.success { background-color: rgba(34, 197, 94, 0.1); color: #22C55E; }
      &.failed { background-color: rgba(239, 68, 68, 0.1); color: #EF4444; }
      &.disabled { background-color: rgba(100, 116, 139, 0.1); color: #64748B; }
      &.running { 
        background-color: rgba(14, 165, 160, 0.1); color: #0EA5A0; 
        .dot { width: 6px; height: 6px; background-color: #0EA5A0; border-radius: 50%; animation: pulse-dot 1.5s infinite; }
      }
    }

    .error-msg {
      display: flex; align-items: center; gap: 4px; font-size: 11px; color: #EF4444; margin-top: 6px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .metrics { font-size: 12px; color: #64748B; margin-top: 4px; }
    .next-time { font-weight: 500; font-size: 14px; }
    .frequency { font-size: 12px; margin-top: 2px; }

    .actions-header { text-align: right; padding-right: 24px; }
    .actions-cell { text-align: right; padding-right: 8px; }
    .toggle-btn { margin-right: 16px; }
    
    .table-row { transition: background-color 0.2s; &:hover { background-color: #F8FAFC; } }

    .empty-state { padding: 48px; text-align: center; color: #94A3B8; mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; } }
  `]
})
export class SchedulerComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'lastRun', 'nextRun', 'actions'];
  schedulers: Scheduler[] = [];
  filteredSchedulers: Scheduler[] = [];
  isLoading = false;

  searchQuery = '';
  statusFilter = 'ALL';
  moduleFilter = 'ALL';

  constructor(private schedulerService: SchedulerService) {}

  ngOnInit() {
    this.loadSchedulers();
  }

  loadSchedulers() {
    this.isLoading = true;
    this.schedulerService.getSchedulers().subscribe(data => {
      this.schedulers = data;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters() {
    this.filteredSchedulers = this.schedulers.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          s.jobClass.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = this.statusFilter === 'ALL' || s.status === this.statusFilter;
      const matchModule = this.moduleFilter === 'ALL' || s.moduleCode === this.moduleFilter;
      return matchSearch && matchStatus && matchModule;
    });
  }

  triggerRun(scheduler: Scheduler) {
    if (confirm(`Are you sure you want to trigger '${scheduler.name}' manually?`)) {
      scheduler.status = 'RUNNING';
      this.schedulerService.triggerRun(scheduler.id).subscribe(() => {
        // Mock successful run after 2s
        setTimeout(() => {
          scheduler.status = 'SUCCESS';
        }, 2000);
      });
    }
  }

  toggleStatus(scheduler: Scheduler, enabled: boolean) {
    this.schedulerService.toggleStatus(scheduler.id, enabled).subscribe(() => {
      scheduler.isEnabled = enabled;
      scheduler.status = enabled ? 'SUCCESS' : 'DISABLED';
    });
  }
}
