import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }
    
    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background-color: #f8f9fa;
    }
  `]
})
export class MainLayoutComponent {}
