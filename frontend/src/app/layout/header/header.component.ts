import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, CommonModule],
  template: `
    <mat-toolbar class="header-toolbar">
      <div class="spacer"></div>
      
      <div class="user-actions">
        <span class="role-badge">ADMIN</span>
        
        <button mat-icon-button class="notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
          <div class="user-info">
            <div class="avatar">OM</div>
            <div class="details">
              <span class="name">Operations Mgr</span>
            </div>
            <mat-icon>arrow_drop_down</mat-icon>
          </div>
        </button>
        
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item class="text-danger">
            <mat-icon color="warn">exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      background-color: white;
      border-bottom: 1px solid #E2E8F0;
      height: 70px;
      padding: 0 24px;
      display: flex;
    }
    
    .spacer {
      flex: 1;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .role-badge {
      background-color: rgba(14, 165, 160, 0.1);
      color: #0EA5A0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .user-menu-btn {
      height: auto;
      padding: 4px 8px;
      border-radius: 8px;
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #1A2B4C;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
      }
      
      .name {
        font-size: 14px;
        font-weight: 500;
        color: #1E293B;
      }
    }
    
    .text-danger {
      color: #EF4444;
    }
  `]
})
export class HeaderComponent {}
