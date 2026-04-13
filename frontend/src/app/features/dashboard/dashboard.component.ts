import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, Module, Product, StageCount, DashboardSummary } from './dashboard.service';
import { Subject, takeUntil, timer, switchMap } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="dashboard-header animate-fade-in">
      <div>
        <h1 class="page-title">Policy Servicing Dashboard</h1>
        <p class="text-muted">Monitor and manage policy payout workflows</p>
      </div>
      
      <!-- Summary Bar -->
      <div class="summary-bar" *ngIf="summary">
        <div class="summary-item">
          <span class="label">Total Today</span>
          <span class="value">{{ summary.totalPoliciesToday | number }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="label">Pipeline Amount</span>
          <span class="value text-teal">{{ summary.amountInPipeline | currency:'INR':'symbol':'1.0-0' }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="label">SLA Breaches</span>
          <span class="value text-danger">{{ summary.slaBreaches }}</span>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar animate-fade-in" style="animation-delay: 0.1s">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Module</mat-label>
        <mat-select [(ngModel)]="selectedModule" (selectionChange)="onModuleChange()">
          <mat-option *ngFor="let mod of modules" [value]="mod.code">{{ mod.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Product ID</mat-label>
        <mat-select [(ngModel)]="selectedProduct" (selectionChange)="loadStageCounts()">
          <mat-option value="ALL">All Products</mat-option>
          <mat-option *ngFor="let prod of products" [value]="prod.id">{{ prod.name }} ({{ prod.id }})</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Date Range</mat-label>
        <mat-select [(ngModel)]="selectedDateRange" (selectionChange)="loadStageCounts()">
          <mat-option value="TODAY">Today</mat-option>
          <mat-option value="WEEK">This Week</mat-option>
          <mat-option value="MONTH">This Month</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="spacer"></div>

      <div class="refresh-indicator">
        <mat-icon class="spin-icon" [class.spinning]="isLoading">sync</mat-icon>
        <span class="text-muted">Auto-refreshes in {{ autoRefreshSeconds }}s</span>
      </div>
    </div>

    <!-- Stage Cards Grid -->
    <div class="stage-grid">
      <div *ngFor="let stage of stageCounts; let i = index" 
           class="stage-card animate-fade-in" 
           [style.animation-delay]="(0.15 + (i * 0.05)) + 's'"
           [ngClass]="getHoverClass(stage.stageCode)"
           (click)="openDrillDown(stage.stageCode)">
        
        <div class="card-header">
          <span class="stage-name" [ngClass]="getTextClass(stage.stageCode)">{{ stage.stageName }}</span>
          <mat-icon class="drill-icon" [ngClass]="getTextClass(stage.stageCode)">arrow_forward_ios</mat-icon>
        </div>
        
        <div class="card-body">
          <div class="count">{{ stage.count | number }}</div>
          
          <div class="trend" [ngClass]="stage.percentChange >= 0 ? 'trend-up' : 'trend-down'">
            <mat-icon>{{ stage.percentChange >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
            <span>{{ Math.abs(stage.percentChange) }}% vs yesterday</span>
          </div>
        </div>

        <div class="card-footer" *ngIf="stage.stageCode !== 'TOTAL'">
          <div class="aging-indicator">
            <span class="dot" [ngClass]="stage.count > 10 ? 'red' : 'amber'"></span>
            <span>{{ Math.floor(stage.count * 0.15) }} records > 3 days</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Placeholder -->
    <div class="chart-container animate-fade-in" style="animation-delay: 0.4s">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Stage-wise Trend (Last 7 Days)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-container-wrapper" style="position: relative; height:300px; width:100%">
            <canvas id="trendChart"></canvas>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-title { margin: 0 0 4px 0; font-size: 24px; font-weight: 600; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
    
    .summary-bar {
      display: flex;
      background: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      align-items: center;
    }
    .summary-item { display: flex; flex-direction: column; }
    .summary-item .label { font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600; }
    .summary-item .value { font-size: 20px; font-weight: 700; color: #1E293B; }
    .summary-divider { width: 1px; height: 30px; background: #E2E8F0; margin: 0 20px; }
    .text-danger { color: #EF4444 !important; }

    .filter-bar {
      display: flex; gap: 16px; background: white; padding: 16px 20px 0; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); align-items: center;
    }
    .filter-field { width: 220px; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .spacer { flex: 1; }
    .refresh-indicator { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 16px; }
    
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .spinning { animation: spin 1s linear infinite; }
    .spin-icon { font-size: 18px; width: 18px; height: 18px; color: #0EA5A0; }

    .stage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px; }
    
    .stage-card {
      background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-top: 4px solid #E2E8F0;
      &:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0,0,0,0.1); .drill-icon { opacity: 1; transform: translateX(0); } }
    }

    /* Card Themes */
    .card-extract { border-top-color: #3B82F6; }
    .card-approve { border-top-color: #6366F1; }
    .card-tech { border-top-color: #F59E0B; }
    .card-sanction { border-top-color: #F97316; }
    .card-paid { border-top-color: #22C55E; }
    
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .stage-name { font-weight: 600; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
    .drill-icon { font-size: 16px; width: 16px; height: 16px; opacity: 0; transform: translateX(-10px); transition: all 0.3s; }

    .card-body { margin-bottom: 16px; }
    .count { font-size: 36px; font-weight: 700; color: #1E293B; line-height: 1.2; margin-bottom: 4px; }
    
    .trend { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
    .trend mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .trend-up { color: #22C55E; }
    .trend-down { color: #EF4444; }

    .card-footer { padding-top: 12px; border-top: 1px solid #F1F5F9; }
    .aging-indicator { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748B; font-weight: 500; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.amber { background-color: #F59E0B; }
    .dot.red { background-color: #EF4444; }

    .chart-container { margin-bottom: 24px; }
    .chart-placeholder { height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #94A3B8; background: #F8FAFC; border-radius: 8px; border: 1px dashed #CBD5E1; }
    .chart-placeholder mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  Math = Math;
  private destroy$ = new Subject<void>();
  
  modules: Module[] = [];
  products: Product[] = [];
  summary: DashboardSummary | null = null;
  stageCounts: StageCount[] = [];
  
  selectedModule: string = 'SB';
  selectedProduct: string = 'ALL';
  selectedDateRange: string = 'TODAY';
  
  isLoading = false;
  autoRefreshSeconds = 300; // 5 mins

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadModules();
    this.loadSummary();
    this.setupAutoRefresh();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupAutoRefresh() {
    timer(0, 1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.autoRefreshSeconds--;
      if (this.autoRefreshSeconds <= 0) {
        this.loadStageCounts();
        this.autoRefreshSeconds = 300;
      }
    });
  }

  loadModules() {
    this.isLoading = true;
    this.dashboardService.getModules().subscribe(mods => {
      this.modules = mods;
      if (mods.length > 0) {
        this.selectedModule = mods[0].code;
        this.onModuleChange();
      }
    });
  }

  onModuleChange() {
    this.isLoading = true;
    this.dashboardService.getProducts(this.selectedModule).subscribe(prods => {
      this.products = prods;
      this.selectedProduct = 'ALL';
      this.loadStageCounts();
    });
  }

  loadStageCounts() {
    this.isLoading = true;
    this.dashboardService.getStageCounts(this.selectedModule, this.selectedProduct, this.selectedDateRange)
      .subscribe(counts => {
        this.stageCounts = counts;
        this.isLoading = false;
        this.loadChart();
      });
  }

  loadSummary() {
    this.dashboardService.getSummary().subscribe(s => this.summary = s);
  }

  loadChart() {
    this.dashboardService.getTrendData(this.selectedModule, this.selectedProduct).subscribe(data => {
      this.renderChart(data);
    });
  }

  chartInstance: any;

  renderChart(data: any) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    const ctx = document.getElementById('trendChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  openDrillDown(stageCode: string) {
    if (stageCode === 'TOTAL') return;
    alert(`Opening drill-down grid for stage ${stageCode}...`);
  }

  getHoverClass(code: string): string {
    const map: any = {
      'EXTRACT': 'card-extract',
      'APPROVE': 'card-approve',
      'TECH_BUCKET': 'card-tech',
      'SANCTION': 'card-sanction',
      'PAID': 'card-paid'
    };
    return map[code] || '';
  }

  getTextClass(code: string): string {
    const map: any = {
      'EXTRACT': 'stage-blue',
      'APPROVE': 'stage-indigo',
      'TECH_BUCKET': 'stage-amber',
      'SANCTION': 'stage-orange',
      'PAID': 'stage-green'
    };
    return map[code] || '';
  }
}
