import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="logo-container">
        <mat-icon class="logo-icon">shield</mat-icon>
        <span class="logo-text" *ngIf="!isCollapsed">PolicyServicing</span>
      </div>
      
      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <mat-icon>dashboard</mat-icon>
          <span *ngIf="!isCollapsed">Dashboard</span>
        </a>
        <a routerLink="/schedulers" routerLinkActive="active" class="nav-item">
          <mat-icon>schedule</mat-icon>
          <span *ngIf="!isCollapsed">Schedulers</span>
        </a>
      </nav>

      <div class="toggle-btn" (click)="toggleSidebar()">
        <mat-icon>{{ isCollapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background-color: #1A2B4C;
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: relative;
      
      &.collapsed {
        width: 70px;
        .nav-item {
          justify-content: center;
          padding: 12px 0;
          mat-icon { margin-right: 0; }
        }
      }
    }

    .logo-container {
      display: flex;
      align-items: center;
      padding: 24px 20px;
      height: 70px;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      
      .logo-icon {
        color: #0EA5A0;
        margin-right: 12px;
      }
      
      .logo-text {
        font-weight: 600;
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .nav-menu {
      flex: 1;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
      
      mat-icon {
        margin-right: 16px;
      }
      
      &:hover, &.active {
        background-color: rgba(14, 165, 160, 0.1);
        color: #0EA5A0;
        border-right: 3px solid #0EA5A0;
      }
    }

    .toggle-btn {
      position: absolute;
      bottom: 20px;
      right: -15px;
      width: 30px;
      height: 30px;
      background-color: #0EA5A0;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      z-index: 10;
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
