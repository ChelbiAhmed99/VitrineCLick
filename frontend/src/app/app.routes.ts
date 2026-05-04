import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin/admin.component';
import { UserPanelComponent } from './user/user.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { LandingPanelComponent } from './landing/landing.component';
import { SiteViewerComponent } from './landing/site-viewer.component';
import { PricingComponent } from './landing/pricing.component';

export const routes: Routes = [
  { path: '', component: LandingPanelComponent },
  { path: 's/:subdomain', component: SiteViewerComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: 'user', component: UserPanelComponent, canActivate: [UserGuard] },
  { path: 'pricing', component: PricingComponent }
];
