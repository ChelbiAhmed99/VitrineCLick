import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/subscriptions`;

export interface PlanStatus {
  planTier: 'BASIC' | 'PRO' | 'BUSINESS';
  status: string;
  billingCycle: string;
  startDate?: string;
  endDate?: string;
  features: string[];
  maxSites: number;
  maxAiCalls: number;
  siteCount: number;
  aiUsage: number;
}

export interface Plan {
  tier: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular: boolean;
  features: string[];
  maxSites: number;
  maxAiCalls: number;
  description: string;
}

// Feature key constants — must match backend PlanService
export const FEATURES = {
  CREATE_SITE:        'CREATE_SITE',
  MULTI_SITES:        'MULTI_SITES',
  PREMIUM_TEMPLATES:  'PREMIUM_TEMPLATES',
  AI_BASIC:           'AI_BASIC',
  AI_ADVANCED:        'AI_ADVANCED',
  AI_LOGOS:           'AI_LOGOS',
  DOWNLOAD_ASSETS:    'DOWNLOAD_ASSETS',
  CUSTOM_DOMAIN:      'CUSTOM_DOMAIN',
  SEO_ADVANCED:       'SEO_ADVANCED',
  ANALYTICS_BASIC:    'ANALYTICS_BASIC',
  ANALYTICS_REALTIME: 'ANALYTICS_REALTIME',
  ANALYTICS_ADVANCED: 'ANALYTICS_ADVANCED',
  TEAM_MANAGEMENT:    'TEAM_MANAGEMENT',
  WHITE_LABEL:        'WHITE_LABEL',
  API_ACCESS:         'API_ACCESS',
  EXPORT_DATA:        'EXPORT_DATA',
  FAST_DEPLOY:        'FAST_DEPLOY',
  PRIORITY_SUPPORT:   'PRIORITY_SUPPORT',
  PREMIUM_SUPPORT:    'PREMIUM_SUPPORT',
  CLIENT_MANAGEMENT:  'CLIENT_MANAGEMENT',
};

const DEFAULT_STATUS: PlanStatus = {
  planTier: 'BASIC',
  status: 'FREE',
  billingCycle: 'NONE',
  features: ['CREATE_SITE', 'AI_BASIC', 'ANALYTICS_BASIC'],
  maxSites: 1,
  maxAiCalls: 10,
  siteCount: 0,
  aiUsage: 0,
};

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private statusSubject = new BehaviorSubject<PlanStatus>(DEFAULT_STATUS);
  public status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.getToken()) {
      this.loadStatus();
    }
  }

  /** Load current user's plan status from backend */
  loadStatus(): Observable<PlanStatus> {
    return this.http.get<PlanStatus>(`${API}/status`).pipe(
      tap(s => this.statusSubject.next(s)),
      catchError(() => of(DEFAULT_STATUS))
    );
  }

  /** Returns the current plan status snapshot */
  getStatus(): PlanStatus {
    return this.statusSubject.getValue();
  }

  /** Get all available plans */
  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${API}/plans`);
  }

  /** Simulate checkout / plan upgrade */
  checkout(planTier: string, billingCycle: 'MONTHLY' | 'ANNUAL'): Observable<any> {
    return this.http.post(`${API}/checkout`, { planTier, billingCycle }).pipe(
      tap(() => this.loadStatus().subscribe())
    );
  }

  /** Check if the current user has a given feature */
  hasFeature(feature: string): boolean {
    const features = this.statusSubject.getValue().features;
    return Array.isArray(features) && features.includes(feature);
  }

  /** Returns current plan tier */
  getPlanTier(): string {
    return this.statusSubject.getValue().planTier || 'BASIC';
  }

  /** Returns true if the user can still create a new site */
  canCreateSite(): boolean {
    const s = this.statusSubject.getValue();
    if (s.maxSites < 0) return true; // unlimited
    return s.siteCount < s.maxSites;
  }

  /** Returns AI usage percentage */
  getAiUsagePercent(): number {
    const s = this.statusSubject.getValue();
    if (s.maxAiCalls < 0) return 0; // unlimited
    return Math.min(100, Math.round((s.aiUsage / s.maxAiCalls) * 100));
  }

  /** Returns a human-readable plan label */
  getPlanLabel(): string {
    const tier = this.getPlanTier();
    return { BASIC: 'Basic', PRO: 'Pro', BUSINESS: 'Business' }[tier] ?? tier;
  }

  /** Returns a color class for the plan badge */
  getPlanColor(): string {
    const tier = this.getPlanTier();
    return {
      BASIC:    'bg-slate-100 text-slate-600',
      PRO:      'bg-orange-100 text-orange-600',
      BUSINESS: 'bg-purple-100 text-purple-600',
    }[tier] ?? 'bg-slate-100 text-slate-600';
  }
}
