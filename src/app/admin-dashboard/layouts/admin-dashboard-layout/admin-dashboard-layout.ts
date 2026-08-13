import { AuthService } from '@/auth/service/auth.service';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {

  autService=inject(AuthService);
  user=computed(()=>this.autService.user());


}
