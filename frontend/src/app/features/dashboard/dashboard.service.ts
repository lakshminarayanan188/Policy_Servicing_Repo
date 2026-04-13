import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Module {
  code: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface StageCount {
  stageCode: string;
  stageName: string;
  count: number;
  previousCount: number;
  percentChange: number;
}

export interface DashboardSummary {
  totalPoliciesToday: number;
  amountInPipeline: number;
  slaBreaches: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  constructor() { }

  getModules(): Observable<Module[]> {
    return of([
      { code: 'SB', name: 'Survival Benefit (SB)' },
      { code: 'MAT', name: 'Maturity' },
      { code: 'ANN', name: 'Annuity' },
      { code: 'SUR', name: 'Surrender' },
      { code: 'DEC', name: 'Death Claim' }
    ]).pipe(delay(400));
  }

  getProducts(moduleCode: string): Observable<Product[]> {
    const products: Record<string, Product[]> = {
      'SB': [
        { id: 'P001', name: 'Endowment Plan A' },
        { id: 'P002', name: 'Money Back Plan' }
      ],
      'MAT': [
        { id: 'P003', name: 'Jeevan Anand' },
        { id: 'P004', name: 'Endowment Plan B' }
      ],
      'ANN': [
        { id: 'P005', name: 'Pension Plus' }
      ]
    };
    return of(products[moduleCode] || [{ id: 'ALL', name: 'All Products' }]).pipe(delay(300));
  }

  getStageCounts(module: string, productId: string, dateRange: string): Observable<StageCount[]> {
    return of([
      { stageCode: 'EXTRACT', stageName: 'Extract', count: 120, previousCount: 110, percentChange: 9.1 },
      { stageCode: 'APPROVE', stageName: 'Approve', count: 84, previousCount: 90, percentChange: -6.7 },
      { stageCode: 'TECH_BUCKET', stageName: 'Tech Bucket', count: 31, previousCount: 30, percentChange: 3.3 },
      { stageCode: 'SANCTION', stageName: 'Sanction', count: 22, previousCount: 20, percentChange: 10.0 },
      { stageCode: 'PAID', stageName: 'Paid', count: 410, previousCount: 380, percentChange: 7.9 },
      { stageCode: 'TOTAL', stageName: 'Total Pending', count: 257, previousCount: 250, percentChange: 2.8 }
    ]).pipe(delay(600));
  }

  getSummary(): Observable<DashboardSummary> {
    return of({
      totalPoliciesToday: 667,
      amountInPipeline: 2450000,
      slaBreaches: 5
    }).pipe(delay(400));
  }

  getTrendData(module: string, productId: string, days: number = 7): Observable<any> {
    // Mock chart data
    return of({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: 'Extract', data: [100, 110, 105, 120, 115, 90, 120], borderColor: '#3B82F6', tension: 0.4 },
        { label: 'Paid', data: [350, 380, 400, 390, 410, 310, 410], borderColor: '#22C55E', tension: 0.4 }
      ]
    }).pipe(delay(800));
  }
}
